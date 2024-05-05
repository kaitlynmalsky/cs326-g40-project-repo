import View from '../View.js';
import dbInstance from '../database.js';

const icnsStatic = [
    'fa-solid fa-house-chimney-window',
    'fa-solid fa-kiwi-bird',
    'fa-solid fa-headphones',
    'fa-solid fa-hat-cowboy',
];
const icnsDynamic = [
    'fa-solid fa-house-chimney-window fa-bounce',
    'fa-solid fa-kiwi-bird fa-bounce',
    'fa-solid fa-headphones fa-bounce',
    'fa-solid fa-hat-cowboy fa-bounce',
];
/**
 * Makes an HTML element given defined attributes.
 * @param {string} type 
 * @param {string} id 
 * @param {string[]} [classes] 
 * @param {HTMLElement} [parent] 
 * @returns {HTMLElement}
 */
function makeElement(type, id, classes, parent) {
    const elem = document.createElement(type);
    elem.id = id;
    if (classes) classes.forEach((c) => elem.classList.add(c));
    if (parent) parent.appendChild(elem);
    return elem;
}

export default class ProfileView extends View {
    constructor() {
        super();
    }

    async render() {
        const profilePageDiv = makeElement('div', 'profilePage-view');

        const creatorContainer = makeElement('div', 'creatorContainer', null, profilePageDiv);
        const creatorContainerGrid = makeElement('div', null, ['grid', 'grid-cols-2'], creatorContainer);

        const creatorContainerLeft = makeElement('div', 'creatorContainerLeft', null, creatorContainerGrid);
        const creatorContainerRight = makeElement('div', 'creatorContainerRight', null, creatorContainerGrid);

        const pageLabel = makeElement('h1', 'pageLabel', null, creatorContainerLeft);
        pageLabel.innerText = 'Profile Editor';

        const spacer = makeElement('div', null, null, creatorContainerRight);
        spacer.style.minHeight = "45px";

        const userDiv = makeElement('div', 'userDiv', null, creatorContainerRight);

        for (let i = 0; i < 3; i++) creatorContainerRight.appendChild(document.createElement('br'));

        const userNameLabel = makeElement('h1', 'userNameLabel', null, userDiv);
        userNameLabel.innerText = "Username:";

        const userName = /** @type {HTMLInputElement}*/ (makeElement('input', 'userName', null, userDiv));
        userName.type = 'text';
        userName.value = (
            await dbInstance.getUser(await dbInstance.getCurrentUserID()) // do not replacewith fetch call
        ).username;

        const iconPreview = /**@type {HTMLCanvasElement}*/ (makeElement('canvas', 'myIcon', null, creatorContainerLeft));
        iconPreview.width = 300;
        iconPreview.height = 300;

        const chooseContainer = makeElement('div', 'chooseContainer', ['gap-y-3'], creatorContainerRight);


        const bioLabel = document.createElement('h1');
        bioLabel.innerText = "Bio:";
        bioLabel.id = "bioLabel";
        const bioArea = document.createElement('div');
        bioArea.appendChild(bioLabel);
        bioArea.id = "bioArea";
        bioArea.className = "h-max";
        creatorContainer.appendChild(bioArea);
        const bioInput = document.createElement('textarea');
        bioInput.id = "bioInput";
        bioInput.classList.add("p-1");
        bioArea.appendChild(bioInput);
        bioInput.value = (
            await dbInstance.getUser(await dbInstance.getCurrentUserID())
        ).bio;

        ['Bg', 'Body', 'Ears', 'Hat'].forEach((option, i) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'grid grid-cols-8';

            const backArrow = document.createElement('button');
            backArrow.id = `${option}-back`;
            backArrow.classList.add('arrow');
            backArrow.classList.add('col-span-1');
            backArrow.classList.add(`back${option}`);
            backArrow.innerHTML = '<i class="fa-solid fa-caret-left"></i>';
            optionDiv.appendChild(backArrow);

            const icon = document.createElement('i');
            icon.className = 'justify-self-center ' + icnsStatic[i];
            icon.classList.add('icn');
            icon.id = `${option}-icn`;
            optionDiv.appendChild(icon);

            const forwardArrow = document.createElement('button');
            forwardArrow.id = `${option}-forward`;
            forwardArrow.classList.add('arrow');
            forwardArrow.classList.add('col-span-1');
            forwardArrow.classList.add(`forward${option}`);
            forwardArrow.innerHTML = '<i class="fa-solid fa-caret-right"></i>';
            optionDiv.appendChild(forwardArrow);

            chooseContainer.appendChild(optionDiv);
        });

        const saveButton = document.createElement('button');
        saveButton.id = 'save';
        saveButton.innerText = 'Save';
        bioArea.appendChild(saveButton);

        return profilePageDiv;
    }

    async onLoad() {
        const ctx = /**@type {HTMLCanvasElement} */ (
            document.getElementById('myIcon')
        ).getContext('2d');

        /**
         * Creates a layer object representing a layer on the Profile Canvas.
         * @param {String} n - name of the layer
         * @param {String[]} images - array of all the different options in the layer
         * @returns {{name: String, imgs: String[], img: HTMLImageElement, i: number}} - layer object
         */
        const createLayer = (n, images) => {
            return {
                name: n,
                imgs: images,
                img: new Image(),
                i: 0,
            };
        };

        const body = createLayer('body', [
            '../icons/options/ketchupRaccoon.png',
            '../icons/options/limeRaccoon.png',
            '../icons/options/cheeseRaccoon.png',
            '../icons/options/blueberryRaccoon.png',
            '../icons/options/bubblegumRaccoon.png',
            '../icons/options/ketchupCat.png',
            '../icons/options/limeCat.png',
            '../icons/options/cheeseCat.png',
            '../icons/options/blueberryCat.png',
            '../icons/options/bubblegumCat.png'
        ]);
        const ears = createLayer('ears', [
            '../icons/options/ketchupRaccoonEars.png',
            '../icons/options/limeRaccoonEars.png',
            '../icons/options/cheeseRaccoonEars.png',
            '../icons/options/blueberryRaccoonEars.png',
            '../icons/options/bubblegumRaccoonEars.png',
            '../icons/options/ketchupCatEars.png',
            '../icons/options/limeCatEars.png',
            '../icons/options/cheeseCatEars.png',
            '../icons/options/blueberryCatEars.png',
            '../icons/options/bubblegumCatEars.png',
        ]);
        const hat = createLayer('hat', ['', '../icons/options/sombrero.png']);
        const bg = createLayer('bg', [
            '../icons/options/theStarryNight.png',
            '../icons/options/sunflowers.png',
            '../icons/options/kanagawaWave.png',
        ]);

        const layers = [bg, ears, body, hat];


        let user;
        try {

            const getResponse = await fetch(`/users/me`, { method: "GET" });
            if (!getResponse.ok) {
                console.error(`failed to get data of current user`);
            }
            user = await getResponse.json();
        } catch (err) {
            console.error(`failed getting user data: ${err}`);
        }

        layers.forEach((l) => (l.i = user.avatarConfig[l.name]));

        /**
         * Loads the image field of each object in the layers array in a manner that layers them on top of each other on the Profile Canvas.
         * @param {number} x - the index of the first layer to be loaded
         */
        const render2 = (x) => {
            if (x === layers.length) return;
            layers[x].img.onload = () => {
                ctx.drawImage(layers[x].img, 0, 0, 300, 300);
                render2(++x);
            };
            layers[x].img.src = layers[x].imgs[layers[x].i];
        };

        render2(0);

        /**
         * Initializes the button functionality corresponding to the layer it traverses through.
         * @param {{name: String, imgs: String[], img: HTMLImageElement, i: number}} obj - Object that represents a layer in the Profile Canvas
         * @param {String} option - Name of the layer being initialized
         * @param {number} pos - Current index of the image being utilized in the user's layer
         */
        const init = (obj, option, pos) => {
            const icn = document.getElementById(`${option}-icn`);
            const f = document.getElementById(`${option}-forward`);
            const b = document.getElementById(`${option}-back`);
            const animation = (btn) => {
                btn.addEventListener('mouseover', () => {
                    icnsStatic[pos].split(' ').forEach((c) => icn.classList.remove(c));
                    icnsDynamic[pos].split(' ').forEach((c) => icn.classList.add(c));
                });
                btn.addEventListener('mouseout', () => {
                    icnsDynamic[pos].split(' ').forEach((c) => icn.classList.remove(c));
                    icnsStatic[pos].split(' ').forEach((c) => icn.classList.add(c));
                });
            };
            f.addEventListener('click', () => {
                obj.i = obj.i + 1 >= obj.imgs.length ? 0 : obj.i + 1;
                render2(0);
            });
            animation(f);
            b.addEventListener('click', () => {
                obj.i = obj.i - 1 < 0 ? obj.imgs.length - 1 : obj.i - 1;
                render2(0);
            });
            animation(b);
        };

        document.getElementById('save').addEventListener('click', async() => {
            const userName = /**@type {HTMLInputElement} */ (
                document.getElementById('userName')
            );
            user.avatar = /**@type {HTMLCanvasElement} */ (
                document.getElementById('myIcon')
            ).toDataURL('image/jpeg', 1);
            layers.forEach((l) => (user.avatarConfig[l.name] = l.i));
            if (userName.value !== '' && userName.value !== user.username)
                user.username = userName.value;
            const bioInput = /** @type {HTMLTextAreaElement} */ (document.getElementById('bioInput'));
            const bioText = bioInput.value;
            user.bio = bioText;
            try {
                const putResponse = await fetch(`/users/${user.userID}`, { method: "PUT", body: JSON.stringify(user) });
                if (!putResponse.ok) {
                    throw new Error(`Failed to update user`);
                }
                console.log("user updated successfully");
            } catch (err) {
                console.error(`Put failed: ${err}`);
            }
            //await dbInstance.updateUser(user);

            const saveNoti = document.createElement('i');
            saveNoti.className = 'fa-regular fa-circle-check';
            saveNoti.id = 'saveNoti';
            document.getElementById('profilePage-view').appendChild(saveNoti);

            let op = 1;
            saveNoti.style.opacity = op + '';
            for (let i = 0; i < 500; i++) {
                setTimeout(() => {
                    op -= 0.002;
                    saveNoti.style.opacity = op + '';
                }, i);
            }
            setTimeout(() => saveNoti.remove(), 500);
        });

        init(bg, 'Bg', 0);
        init(body, 'Body', 1);
        init(ears, 'Ears', 2);
        init(hat, 'Hat', 3);
    }
}