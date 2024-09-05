const container = document.querySelector("#container");

let currX = 0, currY = 0, newX = 0, newY = 0;
let highestZIndex = 1;

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const bringToFront = (card) => {
    highestZIndex++;
    card.style.zIndex = highestZIndex;
}

const mouseDown = (e) => {
    if (e.target.classList.contains("card")) {
        currX = e.clientX;
        currY = e.clientY;

        bringToFront(e.target);

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    } else if (e.target.id === "add-new") {
        const newCard = document.createElement("div");
        newCard.classList.add("card");
        newCard.style.backgroundColor = getRandomColor();
        container.appendChild(newCard);
        bringToFront(newCard);
    }
}

const mouseMove = (e) => {
    newX = e.clientX - currX;
    newY = e.clientY - currY;

    currX = e.clientX;
    currY = e.clientY;

    const card = document.querySelector(".card:active");
    if (card) {
        card.style.top = (card.offsetTop + newY) + "px";
        card.style.left = (card.offsetLeft + newX) + "px";
    }
}

const mouseUp = () => {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
}

container.addEventListener('mousedown', mouseDown);