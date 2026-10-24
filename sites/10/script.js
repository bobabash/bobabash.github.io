const pumpBtn = document.getElementById("pump");

const audio = [
  "assets/aud1.m4a",
  "assets/aud2.m4a",
  "assets/aud3.m4a",
  "assets/aud4.m4a",
  "assets/aud5.mp3",
];

pumpBtn.addEventListener("click", () => {
  const ran = Math.floor(Math.random() * 5);

  const selected = audio[ran];

  const sound = new Audio(selected);

  sound.play().catch((error) => {
    console.log("failed", error);
  });
});
