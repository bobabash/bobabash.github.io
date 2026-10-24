const thunder = document.getElementById("th");
const hero = document.querySelector(".hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function triggerThunderBurst() {
    if (!thunder || !hero || reduceMotion.matches) {
        return;
    }

    const burstCount = Math.floor(Math.random() * 3) + 1;
    const burstGap = 80 + Math.random() * 70;

    for (let index = 0; index < burstCount; index += 1) {
        window.setTimeout(() => {
            thunder.classList.remove("thunder-active");
            void thunder.offsetWidth;
            thunder.classList.add("thunder-active");

            hero.classList.remove("thunder-flash");
            void hero.offsetWidth;
            hero.classList.add("thunder-flash");
        }, index * burstGap);
    }
}

if (thunder && hero && !reduceMotion.matches) {
    triggerThunderBurst();
    window.setInterval(triggerThunderBurst, 15000);
}

reduceMotion.addEventListener("change", (event) => {
    if (event.matches) {
        thunder?.classList.remove("thunder-active");
        hero?.classList.remove("thunder-flash");
    }
});
