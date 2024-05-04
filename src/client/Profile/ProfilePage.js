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

export default class ProfileView extends View {
    constructor() {
        super();
    }

    async render() {
        const profilePageDiv = document.createElement('div');
        profilePageDiv.id = 'profilePage-view';

        const creatorContainer = document.createElement('div');
        const creatorContainerGrid = document.createElement('div');
        creatorContainer.appendChild(creatorContainerGrid);
        creatorContainer.id = 'creatorContainer';
        profilePageDiv.appendChild(creatorContainer);
        creatorContainerGrid.classList.add('grid');
        creatorContainerGrid.classList.add('grid-cols-2');

        const creatorContainerLeft = document.createElement('div');
        creatorContainerLeft.id = 'creatorContainerLeft';
        const creatorContainerRight = document.createElement('div');
        creatorContainerRight.id = 'creatorContainerRight';
        creatorContainerGrid.appendChild(creatorContainerLeft);
        creatorContainerGrid.appendChild(creatorContainerRight);

        const pageLabel = document.createElement('h1');
        pageLabel.innerText = 'Profile Editor';
        pageLabel.id = 'pageLabel';
        creatorContainerLeft.appendChild(pageLabel);


        const spacer = document.createElement('div');
        spacer.style.minHeight = "45px";

        const userDiv = document.createElement('div');
        userDiv.id = 'userDiv';
        creatorContainerRight.appendChild(spacer);
        creatorContainerRight.appendChild(userDiv);

        creatorContainerRight.appendChild(document.createElement('br'));
        creatorContainerRight.appendChild(document.createElement('br'));
        creatorContainerRight.appendChild(document.createElement('br'));


        const userNameLabel = document.createElement('h1');
        userNameLabel.innerText = 'Username:';
        userNameLabel.id = 'userNameLabel';
        userDiv.appendChild(userNameLabel);

        const userName = document.createElement('input');
        userName.type = 'text';
        userName.id = 'userName';
        userName.value = (
            await dbInstance.getUser(dbInstance.getCurrentUserID())
        ).username;
        userDiv.appendChild(userName);

        const iconPreview = document.createElement('canvas');
        iconPreview.id = 'myIcon';
        iconPreview.width = 300;
        iconPreview.height = 300;
        creatorContainerLeft.appendChild(iconPreview);

        const chooseContainer = document.createElement('div');
        chooseContainer.className = 'gap-y-3';
        chooseContainer.id = 'chooseContainer';
        creatorContainerRight.appendChild(chooseContainer);


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
        bioArea.appendChild(bioInput);

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
        creatorContainerRight.appendChild(saveButton);

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
        ]);
        const ears = createLayer('ears', [
            '../icons/options/ketchupRaccoonEars.png',
            '../icons/options/limeRaccoonEars.png',
            '../icons/options/cheeseRaccoonEars.png',
        ]);
        const hat = createLayer('hat', ['', '../icons/options/sombrero.png']);
        const bg = createLayer('bg', [
            '../icons/options/theStarryNight.png',
            '../icons/options/sunflowers.png',
            '../icons/options/kanagawaWave.png',
        ]);

        const layers = [bg, ears, body, hat];

        const user = await dbInstance.getUser(dbInstance.getCurrentUserID());

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
            await dbInstance.updateUser(user);

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