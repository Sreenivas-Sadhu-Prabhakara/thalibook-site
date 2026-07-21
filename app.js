/* ThaliBook explainer — tiny interactions, no dependencies.
   1) Sticky-nav active-link highlight on scroll.
   2) Smooth scroll for in-page anchors (with reduced-motion respect).
   3) Signature touch: the hero booking widget "writes its own list" —
      the event goes quoted -> advance taken -> shopping list generates,
      with the per-ingredient quantities filling in and the balance due
      settling. A live demo of the promise. */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );
  var sections = links
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var a = byId[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.style.color = "";
            });
            a.style.color = "var(--accent)";
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------- 2. Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- 3. Signature: the booking writes its own list ---------- */
  var statusEl = document.getElementById("reg-status");
  var caption = document.getElementById("reg-caption");
  var advanceEl = document.getElementById("reg-advance");
  var balanceEl = document.getElementById("reg-balance");
  var rows = document.getElementById("reg-rows");
  var registerEl = rows ? rows.closest(".register") : null;
  var li1 = document.getElementById("li-1");
  var li2 = document.getElementById("li-2");
  var li3 = document.getElementById("li-3");

  if (!statusEl || !caption || !advanceEl || !balanceEl || !rows || !li1) return;

  var tags = Array.prototype.slice.call(rows.querySelectorAll(".reg-row__tag"));

  var QUOTE = 105000;   // 250 heads x Rs 420
  var ADVANCE = 30000;  // advance recorded

  function rupee(n) {
    return "Rs " + n.toLocaleString("en-IN");
  }

  function setTags(text, cls) {
    tags.forEach(function (t) {
      t.textContent = text;
      t.className = "reg-row__tag " + cls;
    });
  }

  // Cycle: quoted (list blank) -> advance taken (list generates) -> reset.
  var stages = [
    {
      status: "Quoted",
      pill: "tag--due",
      caption: "Quoted — the menu is set, but nothing's bought yet.",
      advance: 0,
      balance: QUOTE,
      qty: ["—", "—", "—"],
      tagText: "pending",
      tagCls: "tag--due",
      flash: false
    },
    {
      status: "Booked",
      pill: "tag--paid",
      caption: "Advance recorded → the ingredient shopping list generates itself.",
      advance: ADVANCE,
      balance: QUOTE - ADVANCE,
      qty: ["18.5 kg", "9.0 kg", "21.0 kg"],
      tagText: "to buy",
      tagCls: "tag--paid",
      flash: true
    },
    {
      status: "Booked",
      pill: "tag--paid",
      caption: "Σ(per-plate qty × 250 heads) across every dish — exact, not a guess.",
      advance: ADVANCE,
      balance: QUOTE - ADVANCE,
      qty: ["18.5 kg", "9.0 kg", "21.0 kg"],
      tagText: "to buy",
      tagCls: "tag--due",
      flash: false
    }
  ];

  var i = 0;

  function applyStage(s) {
    statusEl.textContent = s.status;
    statusEl.className = "register__pill";
    caption.textContent = s.caption;
    advanceEl.textContent = rupee(s.advance);
    balanceEl.textContent = rupee(s.balance);
    li1.textContent = s.qty[0];
    li2.textContent = s.qty[1];
    li3.textContent = s.qty[2];
    setTags(s.tagText, s.tagCls);
    if (registerEl && s.flash) {
      var flashRows = Array.prototype.slice.call(rows.querySelectorAll(".reg-row"));
      flashRows.forEach(function (r) { r.classList.add("flash"); });
      setTimeout(function () {
        flashRows.forEach(function (r) { r.classList.remove("flash"); });
      }, 900);
    }
  }

  // Reduced motion: show the fulfilled end-state (booked, list generated) once.
  if (reduceMotion) {
    applyStage(stages[1]);
    caption.textContent =
      "Advance recorded → the ingredient shopping list writes itself.";
    return;
  }

  function advance() {
    i = (i + 1) % stages.length;
    applyStage(stages[i]);
  }

  var running = false;
  var timer = null;

  function loop() {
    timer = setTimeout(function () {
      advance();
      loop();
    }, i === 1 ? 2600 : 2200);
  }

  if (registerEl) {
    var vis = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !running) {
            running = true;
            loop();
          } else if (!e.isIntersecting && running) {
            running = false;
            clearTimeout(timer);
          }
        });
      },
      { threshold: 0.35 }
    );
    vis.observe(registerEl);
  }
})();
