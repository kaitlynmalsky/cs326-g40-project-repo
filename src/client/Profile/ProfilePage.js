import View from '../View.js';
import dbInstance from '../database.js';
import localStorageInstance from '../database.js';


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

export default class ProfileView extends View {
  constructor() {
    super();
  }

  async render() {
    //static html

    const profilePageDiv = document.createElement('div');
    profilePageDiv.id = 'profilePage-view';

    const creatorContainer = document.createElement('div');
    creatorContainer.id = 'creatorContainer';
    profilePageDiv.appendChild(creatorContainer);

    const pageLabel = document.createElement('h1');
    pageLabel.innerText = 'Profile Editor';
    pageLabel.id = 'pageLabel';
    creatorContainer.appendChild(pageLabel);

    const userDiv = document.createElement('div');
    userDiv.id = 'userDiv';
    creatorContainer.appendChild(userDiv);

    const userNameLabel = document.createElement('h1');
    userNameLabel.innerText = 'User Name:';
    userNameLabel.id = 'userNameLabel';
    userDiv.appendChild(userNameLabel);

    const userName = document.createElement('input');
    userName.type = 'text';
    userName.id = 'userName';
    userDiv.appendChild(userName);

    const iconPreview = document.createElement('canvas');
    iconPreview.id = 'myIcon';
    iconPreview.width = 300;
    iconPreview.height = 300;
    creatorContainer.appendChild(iconPreview);

    const chooseContainer = document.createElement('div');
    chooseContainer.className = 'grid grid-cols-1 gap-y-3';
    creatorContainer.appendChild(chooseContainer);

    ['Bg', 'Body', 'Ears', 'Hat'].forEach((option, i) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'grid grid-cols-12'

      const backArrow = document.createElement('button');
      backArrow.id = `${option}-back`
      backArrow.classList.add('arrow');
      backArrow.classList.add('col-span-1');
      backArrow.classList.add(`back${option}`);
      backArrow.innerText = "\u2B9C";
      optionDiv.appendChild(backArrow);

      const icon = document.createElement('i');
      icon.className = 'justify-self-center ' + icnsStatic[i];
      icon.classList.add("icn");
      icon.id = `${option}-icn`;
      optionDiv.appendChild(icon);

      const forwardArrow = document.createElement('button');
      forwardArrow.id = `${option}-forward`;
      forwardArrow.classList.add('arrow');
      forwardArrow.classList.add('col-span-1');
      forwardArrow.classList.add(`forward${option}`);
      forwardArrow.innerText = '\u2B9E';
      optionDiv.appendChild(forwardArrow);
      

      chooseContainer.appendChild(optionDiv);
    });

    const saveButton = document.createElement('button');
    saveButton.id = 'save';
    saveButton.innerText = 'Save';
    creatorContainer.appendChild(saveButton);

    return profilePageDiv;
  }

  async onLoad() {
    //event listeners
    const ctx = /**@type {HTMLCanvasElement} */ (
      document.getElementById('myIcon')
    ).getContext('2d');

    const body = {
      name: 'body',
      imgs: [
        '../icons/options/ketchupRaccoon.png',
        '../icons/options/limeRaccoon.png',
        '../icons/options/cheeseRaccoon.png',
      ],
      img: new Image(),
      i: 0,
    };

    const ears = {
      name: 'ears',
      imgs: [
        '../icons/options/ketchupRaccoonEars.png',
        '../icons/options/limeRaccoonEars.png',
        '../icons/options/cheeseRaccoonEars.png',
      ],
      img: new Image(),
      i: 0,
    };

    const hat = {
      name: 'hat',
      imgs: ['', '../icons/options/sombrero.png'],
      img: new Image(),
      i: 0,
    };

    const bg = {
      name: 'bg',
      imgs: [
        '../icons/options/theStarryNight.png',
        '../icons/options/sunflowers.png',
        '../icons/options/kanagawaWave.png',
      ],
      img: new Image(),
      i: 0,
    };

    const layers = [bg, ears, body, hat];

    const user = await dbInstance.getUser(dbInstance.getCurrentUserID());

    layers.forEach(l => l.i = user.avatarConfig[l.name]);

    const render2 = (x) => {
      if (x === layers.length) return;
      layers[x].img.onload = () => {
        ctx.drawImage(layers[x].img, 0, 0, 300, 300);
        render2(++x);
      };
      layers[x].img.src = layers[x].imgs[layers[x].i];
    };

    render2(0);

    const init = (obj, option, pos) => {
      const icn = document.getElementById(`${option}-icn`);
      const f = document.getElementById(`${option}-forward`);
      const b = document.getElementById(`${option}-back`);
      f.addEventListener('click', () => {
        obj.i = obj.i + 1 >= obj.imgs.length ? 0 : obj.i + 1;
        render2(0);
      });
      f.addEventListener("mouseover", () => {
        icnsStatic[pos].split(' ').forEach(c => icn.classList.remove(c));
        icnsDynamic[pos].split(' ').forEach(c => icn.classList.add(c));
      });
      f.addEventListener("mouseout", () => {
        icnsDynamic[pos].split(' ').forEach(c => icn.classList.remove(c));
        icnsStatic[pos].split(' ').forEach(c => icn.classList.add(c));
      });
      b.addEventListener('click', () => {
        obj.i = obj.i - 1 < 0 ? obj.imgs.length - 1 : obj.i - 1;
        render2(0);
      });
      b.addEventListener("mouseover", () => {
        icnsStatic[pos].split(' ').forEach(c => icn.classList.remove(c));
        icnsDynamic[pos].split(' ').forEach(c => icn.classList.add(c));
      });
      b.addEventListener("mouseout", () => {
        icnsDynamic[pos].split(' ').forEach(c => icn.classList.remove(c));
        icnsStatic[pos].split(' ').forEach(c => icn.classList.add(c));
      });
    };

    document.getElementById("save").addEventListener("click", async () => {
      user.avatar = (/**@type {HTMLCanvasElement} */ (document.getElementById("myIcon"))).toDataURL("image/jpeg", 1);
      layers.forEach(l => user.avatarConfig[l.name] = l.i);
      if (document.getElementById('userName').value !== "") {
        user.name = document.getElementById('userName').value;
        document.getElementById('userName').value = "";
      }
      await dbInstance.updateUser(user);
    });

    init(bg, 'Bg', 0);
    init(body, 'Body', 1);
    init(ears, 'Ears', 2);
    init(hat, 'Hat', 3);
  }
}
