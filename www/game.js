(() => {
    function i() {
        const c = document.getElementById("game-canvas");
        if (!c) return;
        const t = c.getContext("2d"),
            g = document.getElementById("game-container"),
            img = new Image();
        img.src = "./assets/angrybird.png";
        const F = -3,
            BW = 40,
            BH = 30,
            PW = 50,
            PG = 125;
        let x = 50,
            y = 50,
            v = 0,
            acc = 0.1,
            px = 400,
            py = c.height - 200,
            sd = document.getElementById("score-display"),
            score = 0,
            hs = 0,
            sc = false,
            run = false,
            last = performance.now(),
            BASE = 16.67;

        function flap() {
            v = F
        }
        document.body.onkeyup = function (e) {
            if (e.code === "Space" || e.key === " ") flap()
        };
        c.addEventListener("touchstart", function (e) {
            flap();
            e.preventDefault()
        }, {
            passive: false
        });
        c.addEventListener("mousedown", flap);
        const rb = document.getElementById("restart-button");
        if (rb) rb.addEventListener("click", function () {
            const em = document.getElementById("end-menu");
            if (em) em.style.display = "none";
            x = 50;
            y = 50;
            v = 0;
            acc = 0.1;
            px = 400;
            py = c.height - 200;
            score = 0;
            if (sd) sd.innerHTML = score;
            if (!run) {
                run = true;
                requestAnimationFrame(loop)
            }
        });

        function inc() {
            if (x > px + PW && (y < py + PG || y + BH > py + PG) && !sc) {
                score++;
                if (sd) sd.innerHTML = score;
                sc = true
            }
            if (x < px + PW) sc = false
        }

        function col() {
            if (x + BW > px && x < px + PW && y < py - BH + PG) return true;
            if (x + BW > px && x < px + PW && y + BH > py + PG) return true;
            if (y < 0 || y + BH > c.height) return true;
            return false
        }

        function showEnd() {
            const em = document.getElementById("end-menu");
            if (em) em.style.display = "block";
            if (g) g.classList.add("backdrop-blur");
            const es = document.getElementById("end-score");
            if (es) es.innerHTML = score;
            if (hs < score) hs = score;
            const bs = document.getElementById("best-score");
            if (bs) bs.innerHTML = hs
        }

        function loop(n) {
            run = true;
            const d = (n - last) / BASE;
            last = n;
            t.clearRect(0, 0, c.width, c.height);
            if (img.complete) t.drawImage(img, x, y, BW, BH);
            t.fillStyle = "#333";
            t.fillRect(px, -50, PW, py);
            t.fillRect(px, py + PG, PW, c.height - py);
            if (col()) {
                showEnd();
                run = false;
                return
            }
            px -= 1.5 * d;
            if (px < -50) {
                px = c.width + 50;
                py = Math.random() * (c.height - PG) + PW
            }
            v += acc * d;
            y += v * d;
            inc();
            requestAnimationFrame(loop)
        }
        if (img.complete) requestAnimationFrame(loop);
        else img.onload = function () {
            requestAnimationFrame(loop)
        }
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", i);
    else i();
})();