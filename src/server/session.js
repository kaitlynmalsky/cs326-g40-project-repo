import { Store } from 'express-session';

/**
 * @typedef {(err: any, session?: SessionInfo) => void} Callback
 */

/**
 * @typedef {import('express-session').SessionData & PouchDB.Core.IdMeta & PouchDB.Core.RevisionIdMeta} SessionInfo
 */

export default class PouchDBSessionStore extends Store {
  /**
   * @type {PouchDB.Database}
   */
  #db;

  /**
   * @type {{[sid: string]: SessionInfo}}
   */
  #sessions;

  /**
   *
   * @param {PouchDB.Database} db
   */
  constructor(db) {
    super();
    this.#db = db;
    this.#sessions = {};

    this.#subscribe();
  }

  #subscribe() {
    this.#db
      .changes({
        since: 'now',
        live: true,
        include_docs: true,
        filter: (doc) => doc._id.startsWith('sessions_'),
      })
      .on('change', (change) => {
        const existing = this.#sessions[change.doc._id];

        if (existing) {
          this.#sessions[change.doc._id] = Object.assign(existing, change.doc);
        }
      });
  }

  /**
   * Formats a session key
   * @param {string} sid
   * @returns
   */
  #formatSessionKey(sid) {
    return `sessions_${sid}`;
  }

  /**
   * Gets a session
   * @param {string} sid
   * @param {Callback} callback
   */
  async get(sid, callback) {
    const sessionKey = this.#formatSessionKey(sid);

    if (this.#sessions[sessionKey]) {
      callback(null, this.#sessions[sessionKey]);
    } else {
      try {
        const session = await this.#db.get(sessionKey);
        this.#sessions[sessionKey] = session;
        callback(null, session);
      } catch (err) {
        callback(null);
      }
    }
  }

  /**
   * Create/update a session
   * @param {string} sid
   * @param {SessionInfo} session
   * @param {Callback} callback
   */
  async set(sid, session, callback) {
    const sessionKey = this.#formatSessionKey(sid);
    if (!session._id) session._id = sessionKey;

    //@ts-ignore
    if (session.cookie && session.cookie.toJSON) {
      //@ts-ignore
      session.cookie = session.cookie.toJSON();
    }

    if (this.#sessions[sessionKey]) {
      this.#sessions[sessionKey] = Object.assign(
        this.#sessions[sessionKey],
        session,
      );
    } else {
      try {
        const existing = await this.#db.get(sessionKey);

        this.#sessions[sessionKey] = Object.assign(existing, session);
      } catch (err) {
        this.#sessions[sessionKey] = session;
      }
    }

    try {
      await this.#db.put(this.#sessions[sessionKey]);

      callback(null, this.#sessions[sessionKey]);
    } catch (err) {
      callback(err);
    }
  }

  /**
   * Destroy a session
   * @param {string} sid
   * @param {Callback} callback
   */
  async destroy(sid, callback) {
    const sessionKey = this.#formatSessionKey(sid);

    this.get(sid, async (err, session) => {
      if (this.#sessions[sessionKey]) {
        delete this.#sessions[sessionKey];
      }

      if (!session) {
        return callback();
      }

      try {
        await this.#db.remove(session);
        callback();
      } catch (err) {
        callback(err);
      }
    });
  }
}
