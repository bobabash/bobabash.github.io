const dialogues = document.getElementById('dialogues')

const di1 = document.getElementById('di1')
const di2 = document.getElementById('di2')
const di3 = document.getElementById('di3')
const di4 = document.getElementById('di4')
const di5 = document.getElementById('di5')
const di6 = document.getElementById('di6')

const death = document.getElementById('death')

const bell = new Audio('../assets/bell.mp3')

const images = [
    "../assets/cem1.webp",
    "../assets/cem2.jpg",
    "../assets/cem3.jpg",
    "../assets/cem4.jpg",
    "../assets/cem5.jpg"
];

setTimeout(function(){
    di1.style.animation = 'fadeIn 2s forwards';
}, 1000)

di1.addEventListener('animationend', function(){
    di2.style.animation = 'fadeIn 2s forwards';
})

di2.addEventListener('animationend', function(){
    di3.style.animation = 'fadeIn 2s forwards';
})

di3.addEventListener('animationend', function(){
    di4.style.animation = 'fadeIn 2s forwards';
})

di4.addEventListener('animationend', function(){
    di5.style.animation = 'fadeIn 2s forwards';
})

di5.addEventListener('animationend', function(){
    setTimeout(function(){
        di6.style.animation = 'fadeIn 2s forwards';
    }, 1000)
})

di6.addEventListener("animationend", function(){
    setTimeout(function(){
        dialogues.style.display = 'none'
        death.style.display = 'block'
        bell.play()
        death.style.animation = 'glitch 3s steps(1, end) infinite';
        setTimeout(function(){
            document.body.style.backgroundSize = 'cover'
            document.body.style.backgroundRepeat = 'no-repeat'

            let index = 0;

            setInterval(() => {
                document.body.style.backgroundImage = `url('${images[index]}')`;
                index = (index + 1) % images.length;
            }, 150);
        }, 1000)
    }, 1000)
})



