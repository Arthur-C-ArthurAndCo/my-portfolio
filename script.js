/* La partie ci-dessous a été finalement modifié par l'IA pour pouvoir émettre l'effet de combo que je recherchais */

const namespace = "arthur-corroyez-portfolio-2026";
const key = "remerciements";

let nbLikes = 0;
const boutonLike = document.getElementById("btn-like");

let combo = 0;
let lastClickTime = Date.now();
let comboTimeout;

const megaFlame = document.createElement("div");
megaFlame.className = "mega-flame";
megaFlame.textContent = "🔥";
document.body.appendChild(megaFlame);

if (boutonLike) {
    fetch(`https://api.counterapi.dev/v1/${namespace}/${key}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.value !== undefined) {
                nbLikes = data.value;
                boutonLike.textContent = "❤️‍🔥 Remercier le créateur (" + nbLikes + ")";
            }
        })
        .catch(() => {
            console.log("Impossible de joindre le serveur de score, mode local activé.");
        });

    boutonLike.addEventListener("click", (e) => {
        fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`)
            .then(response => response.json())
            .then(data => {
                if (data && data.value) {
                    nbLikes = data.value;
                    boutonLike.textContent = "❤️‍🔥 Remercier le créateur (" + nbLikes + ")";
                }
            });

        const currentTime = Date.now();
        if (currentTime - lastClickTime < 400) {
            combo++;
        } else {
            combo = 1;
        }
        lastClickTime = currentTime;

        clearTimeout(comboTimeout);
        comboTimeout = setTimeout(() => {
            combo = 0;
            document.body.classList.remove("shake-screen");
            megaFlame.classList.remove("active");
        }, 1000);

        if (combo > 10) {
            megaFlame.classList.add("active");
            const megaScale = Math.min(1 + (combo - 10) * 0.08, 3.5); 
            megaFlame.style.setProperty('--mega-scale', megaScale);
        }

        if (combo > 20) {
            document.body.classList.add("shake-screen");
        }

        const nombreDeFlammes = Math.min(5 + Math.floor(combo / 2), 15);
        for (let i = 0; i < nombreDeFlammes; i++) {
            createFlame(e.clientX, e.clientY, combo);
        }
    });
}

function createFlame(x, y, currentCombo) {
    const flame = document.createElement("span");
    flame.className = "flame-particle";
    flame.textContent = currentCombo > 15 ? (Math.random() > 0.5 ? "💥" : "🔥") : "🔥";

    const scaleMultiplier = Math.min(1 + (currentCombo * 0.05), 2.5);
    flame.style.setProperty('--scale-mult', scaleMultiplier);

    const spreadX = (Math.random() - 0.5) * (60 + (currentCombo * 8));
    const spreadY = (Math.random() - 0.5) * 20 - (currentCombo * 2); 
    
    flame.style.left = x + "px";
    flame.style.top = y + "px";
    flame.style.marginLeft = spreadX + "px";
    flame.style.marginTop = spreadY + "px";

    document.body.appendChild(flame);

    setTimeout(() => {
        flame.remove();
    }, 800);
}