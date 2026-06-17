/* ============================================================
   OpenRAL site — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- stat count-up ---------- */
  const counted = new WeakSet();
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || counted.has(e.target)) return;
      counted.add(e.target);
      const el = e.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const dur = 1100;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-num").forEach((el) => statIO.observe(el));

  /* ---------- capability cards ---------- */
  const FEATURES = [
    { tag: "L0–L1 · HAL + sensors", title: "16 robot manifests", body: "SO-100/101, Franka, UR5e/10e, ALOHA, OpenArm, Rizon4, Unitree H1 & G1, panda_mobile — a typed HAL over ros2_control plus a generalizable sensor catalog (RGB-D, LiDAR, F/T, tactile)." },
    { tag: "L3 · Skill (S1)", title: "Swappable VLA adapters", body: "SmolVLA, π0.5, ACT, Diffusion Policy, xVLA, MolmoAct2, GR00T N1.7 and RLDX-1 behind one Skill interface — quantized, action-chunked, latency-budgeted." },
    { tag: "L1–L2 · perception", title: "Perception → world state", body: "A GStreamer perception bus with RT-DETR / open-vocab detectors, 2D→3D object lift into the map frame, and a 30 Hz tf2-aware world-state snapshot." },
    { tag: "L2 · memory", title: "Spatial memory", body: "A persistent, advisory scene graph the reasoner queries to recall where objects, places and rooms are — open-vocab matching so 'find the mug' resolves to a pose." },
    { tag: "L4 · Reasoning (S2)", title: "Typed reasoner", body: "An LLM emits typed ReasonerToolCall structured tool-calls — ExecuteRskill, navigate, recall, lifecycle — over a palette built from the live skill registry. Bounded replanning, no free-form JSON." },
    { tag: "L6 · Safety", title: "Deny-by-default safety", body: "Python proposes, a separate safety process disposes. Deadman + E-stop forwarders ship today; the allocation-free C++ kernel is hardening toward the EU AI Act 2027 safety-case deadline.", soon: true },
    { tag: "L7 · Observability", title: "Traceable & replayable", body: "OpenTelemetry spans with tensor shapes, a live dashboard, a failure bus, and a rosbag2 ↔ LeRobot dataset flywheel. Every run replayable from its trace." },
    { tag: "L5 · World Action Model", title: "World models", body: "Mental simulation, failure anticipation and replanning subgoals slot in front of the reasoner — the interface ships today, concrete adapters next.", soon: true },
    { tag: "deploy · edge", title: "Edge & TensorRT", body: "ONNX→TensorRT engine build/cache, NF4 quantization, and a sim ↔ real deploy path — the same manifest drives MuJoCo, robosuite, RoboCasa and real hardware." },
  ];
  const grid = document.getElementById("feat-grid");
  if (grid) {
    FEATURES.forEach((f, i) => {
      const card = document.createElement("article");
      card.className = "feat reveal" + (f.soon ? " is-soon" : "");
      card.style.transitionDelay = (i % 3) * 60 + "ms";
      card.innerHTML =
        '<div class="feat-ico">' + f.tag + "</div>" +
        "<h3>" + f.title + (f.soon ? ' <span class="soon">Coming soon</span>' : "") + "</h3>" +
        "<p>" + f.body + "</p>";
      grid.appendChild(card);
      io.observe(card);
    });
  }

  /* ---------- reasoner trace + chip lighting ---------- */
  const TRACE = [
    { tok: "reasoner.tick", arrow: "▸", val: "heartbeat", skill: null },
    { tok: "query_scene", arrow: "▸", val: "vlm · 'table, mug, bottle'", skill: "vlm" },
    { tok: "recall_object", arrow: "▸", val: "'mug' · pose ✓ map", skill: "recall", ok: true },
    { tok: "ExecuteRskill", arrow: "▸", val: "navigate_to_pose", skill: "navigate" },
    { tok: "ExecuteRskill", arrow: "▸", val: "pick('mug')", skill: "pick" },
    { tok: "query_task_progress", arrow: "▸", val: "robometer · 0.72 ↑", skill: "robometer" },
    { tok: "ExecuteRskill", arrow: "▸", val: "place", skill: "place" },
    { tok: "safety.check", arrow: "▸", val: "pass ✓", skill: "safety", ok: true },
  ];
  const body = document.getElementById("trace-body");
  const chips = document.getElementById("chips");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function chip(name) {
    if (!chips || !name) return null;
    return chips.querySelector('[data-skill="' + name + '"]');
  }

  function renderStatic() {
    if (!body) return;
    body.innerHTML = "";
    TRACE.forEach((l) => {
      const div = document.createElement("div");
      div.className = "trace-line" + (l.skill ? " is-skill" : "") + (l.ok ? " is-ok" : "");
      div.style.animation = "none";
      div.style.opacity = "1";
      div.style.transform = "none";
      div.innerHTML =
        '<span class="ttok">' + l.tok + '</span><span class="tarrow">' + l.arrow + '</span><span class="tval">' + l.val + "</span>";
      body.appendChild(div);
      const c = chip(l.skill);
      if (c) c.classList.add("active");
    });
  }

  function runTrace() {
    if (!body) return;
    let i = 0;
    const MAX = 6; // lines kept on screen
    function nextLine() {
      const l = TRACE[i % TRACE.length];

      // clear chip highlights, light current
      chips && chips.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      const c = chip(l.skill);
      if (c) c.classList.add("active");

      const div = document.createElement("div");
      div.className = "trace-line" + (l.skill ? " is-skill" : "") + (l.ok ? " is-ok" : "");
      div.innerHTML =
        '<span class="ttok">' + l.tok + '</span><span class="tarrow">' + l.arrow +
        '</span><span class="tval"></span><span class="tcursor"></span>';
      body.appendChild(div);
      while (body.children.length > MAX) body.removeChild(body.firstChild);

      // type the value
      const valEl = div.querySelector(".tval");
      const cur = div.querySelector(".tcursor");
      const text = l.val;
      let k = 0;
      const typer = setInterval(() => {
        valEl.textContent = text.slice(0, ++k);
        if (k >= text.length) {
          clearInterval(typer);
          if (cur) cur.remove();
          i++;
          setTimeout(nextLine, i % TRACE.length === 0 ? 1300 : 720);
        }
      }, 26);
    }
    nextLine();
  }

  if (reduce) renderStatic();
  else {
    // kick off only when the console is on screen
    const consoleEl = document.querySelector(".console");
    let started = false;
    const traceIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) { started = true; runTrace(); }
      });
    }, { threshold: 0.3 });
    if (consoleEl) traceIO.observe(consoleEl); else runTrace();
  }

  /* ---------- contact form ---------- */
  const form = document.getElementById("contact-form");
  if (form) {
    const statusEl = document.getElementById("form-status");
    const btn = document.getElementById("submit-btn");

    const setStatus = (msg, kind) => {
      statusEl.textContent = msg;
      statusEl.className = "form-status" + (kind ? " " + kind : "");
    };

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const data = {
        audience: form.audience.value,
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
        company: form.company ? form.company.value.trim() : "", // honeypot
      };
      if (!data.name || !data.email || !data.message) {
        setStatus("Please fill in every field.", "err");
        return;
      }

      btn.disabled = true;
      const original = btn.innerHTML;
      btn.innerHTML = "Sending…";
      setStatus("", "");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const out = await res.json().catch(() => ({}));

        if (res.ok) {
          const to = "hello@openral.com";
          setStatus("Message sent to " + to + ". We'll be in touch.", "ok");
          form.reset();
        } else if (res.status === 503 && out.code === "not_configured") {
          const to = "hello@openral.com";
          setStatus("Email isn't wired up yet — please reach us directly at " + to + ".", "info");
        } else {
          setStatus(out.error || "Something went wrong. Please email us directly.", "err");
        }
      } catch (err) {
        setStatus("Network error. Please email us directly at hello@openral.com.", "err");
      } finally {
        btn.disabled = false;
        btn.innerHTML = original;
      }
    });
  }
})();
