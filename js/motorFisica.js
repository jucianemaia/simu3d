const physicsConfig = {
    G: 6.6743e-11,
    h: 10000
};

const G = physicsConfig.G;
let h = physicsConfig.h;
let t = 0;
const speedLevels = [1000, 5000, 10000, 50000, 100000];
let speedIndex = 2; //10000 = velocidade padrão

let v_x1 = 0, v_y1 = 0, v_z1 = 0, v_x2 = 0, v_y2 = 30e3, v_z2 = 0, v_x3 = 0, v_y3 = 38.9e3, v_z3 = 0;
let x1 = 0, y1 = 0, z1 = 0, x2 = 150e9, y2 = 0, z2 = 0, x3 = 69.8e9, y3 = 0, z3 = 0;
let k1_x1 = 0, k1_y1 = 0, k1_z1 = 0, k1_x2 = 0, k1_y2 = 0, k1_z2 = 0, k1_x3 = 0, k1_y3 = 0, k1_z3 = 0;

document.getElementById("speedSelect").addEventListener("change", (e) => {
    h = Number(e.target.value);
});

function reset() {
    t = 0;
    pausou = true;
    parametros();

    document.getElementById("tempo").innerHTML = "&nbsp;0 dias";

    if (typeof limparTrilhas === "function") {
        limparTrilhas();
    }

    const btn = document.getElementById("start");
    btn.textContent = "▶ Iniciar Simulação";
    btn.classList.remove("btn-warning");
    btn.classList.add("btn-primary");
}


reset()


const presets = {
    sistemaSolar: {
        m1: 2e30, x1: 0, y1: 0, z1: 0, vx1: 0, vy1: 0, vz1: 0,
        m2: 4.87e24, x2: 69.8e9, y2: 0, z2: 0, vx2: 0, vy2: 38.9e3, vz2: 0,
        m3: 6e24, x3: 150e9, y3: 0, z3: 0, vx3: 0, vy3: 30e3, vz3: 0
    },

    doisCorpos: {
        m1: 2e30, x1: 0, y1: 0, z1: 0, vx1: 0, vy1: 0, vz1: 0,
        m2: 6e24, x2: 150e9, y2: 0, z2: 0, vx2: 0, vy2: 29.8e3, vz2: 0,
        m3: 0, x3: 0, y3: 0, z3: 0, vx3: 0, vy3: 0, vz3: 0
    },

    binario: {
        m1: 2e30, x1: -50e9, y1: 0, z1: 0, vx1: 0, vy1: -20000, vz1: 0,
        m2: 2e30, x2: 50e9, y2: 0, z2: 0, vx2: 0, vy2: 20000, vz2: 0,
        m3: 0, x3: 0, y3: 0, z3: 0, vx3: 0, vy3: 0, vz3: 0
    }
};

function aplicarPreset(nomePreset) {
    const preset = presets[nomePreset];
    if (!preset) return;

    Object.keys(preset).forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = preset[id];
    });

    reset();
}

document.getElementById("presetSelect").addEventListener("change", (e) => {
    if (e.target.value) {
        aplicarPreset(e.target.value);
    }
});

document.getElementById("speedUp").addEventListener("click", () => {
    acelerarSimulacao();
});

document.getElementById("slowDown").addEventListener("click", () => {
    desacelerarSimulacao();
});


function parametros() {
    
    m1 = Number(document.getElementById('m1').value);
    x1 = Number(document.getElementById('x1').value);
    y1 = Number(document.getElementById('y1').value);
    z1 = Number(document.getElementById('z1').value);
    v_x1 = Number(document.getElementById('vx1').value);
    v_y1 = Number(document.getElementById('vy1').value);
    v_z1 = Number(document.getElementById('vz1').value);

    m2 = Number(document.getElementById('m2').value);
    x2 = Number(document.getElementById('x2').value);
    y2 = Number(document.getElementById('y2').value);
    z2 = Number(document.getElementById('z2').value);
    v_x2 = Number(document.getElementById('vx2').value);
    v_y2 = Number(document.getElementById('vy2').value);
    v_z2 = Number(document.getElementById('vz2').value);
    
    m3 = Number(document.getElementById('m3').value);
    x3 = Number(document.getElementById('x3').value);
    y3 = Number(document.getElementById('y3').value);
    z3 = Number(document.getElementById('z3').value);
    v_x3 = Number(document.getElementById('vx3').value);
    v_y3 = Number(document.getElementById('vy3').value);
    v_z3 = Number(document.getElementById('vz3').value);
}

const painelParametros = document.getElementById('painel-parametros');

painelParametros.addEventListener('input', function (e) {
    if (e.target.matches('input')) {
        reset();
    }
});

atualizarLabelVelocidade();

function gravitacaoUniversal() {

    //h = Number(document.getElementById("acelerar").value);
    document.getElementById("tempo").innerHTML = "&nbsp;" + (t/(3600*24)).toFixed(2) + " dias";

    //k1
    k1_x1 = v_x1;
    k1_y1 = v_y1;
    k1_z1 = v_z1;
    k1_x2 = v_x2;
    k1_y2 = v_y2;
    k1_z2 = v_z2;
    k1_x3 = v_x3;
    k1_y3 = v_y3;
    k1_z3 = v_z3;


    k1_vx1 = - (G * m2 * (x1 - x2)) / (Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2), 1.5))
             - (G * m3 * (x1 - x3)) / (Math.pow(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2) + Math.pow(z3 - z1, 2), 1.5));
    k1_vy1 = - (G * m2 * (y1 - y2)) / (Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2), 1.5))
             - (G * m3 * (y1 - y3)) / (Math.pow(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2) + Math.pow(z3 - z1, 2), 1.5));
    k1_vz1 = - (G * m2 * (z1 - z2)) / (Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2), 1.5))
             - (G * m3 * (z1 - z3)) / (Math.pow(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2) + Math.pow(z3 - z1, 2), 1.5));
    k1_vx2 = - (G * m1 * (x2 - x1)) / (Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2), 1.5))
             - (G * m3 * (x2 - x3)) / (Math.pow(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2), 1.5));
    k1_vy2 = - (G * m1 * (y2 - y1)) / (Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2), 1.5))
             - (G * m3 * (y2 - y3)) / (Math.pow(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2), 1.5));
    k1_vz2 = - (G * m1 * (z2 - z1)) / (Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2), 1.5))
             - (G * m3 * (z2 - z3)) / (Math.pow(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2), 1.5));
    k1_vx3 = - (G * m1 * (x3 - x1)) / (Math.pow(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2) + Math.pow(z3 - z1, 2), 1.5))
             - (G * m2 * (x3 - x2)) / (Math.pow(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2), 1.5));
    k1_vy3 = - (G * m1 * (y3 - y1)) / (Math.pow(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2) + Math.pow(z3 - z1, 2), 1.5))
             - (G * m2 * (y3 - y2)) / (Math.pow(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2), 1.5));
    k1_vz3 = - (G * m1 * (z3 - z1)) / (Math.pow(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2) + Math.pow(z3 - z1, 2), 1.5))
             - (G * m2 * (z3 - z2)) / (Math.pow(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2), 1.5));

    //k2
    k2_x1 = v_x1 + (0.5 * h * k1_vx1);
    k2_y1 = v_y1 + (0.5 * h * k1_vy1);
    k2_z1 = v_z1 + (0.5 * h * k1_vz1);
    k2_x2 = v_x2 + (0.5 * h * k1_vx2);
    k2_y2 = v_y2 + (0.5 * h * k1_vy2);
    k2_z2 = v_z2 + (0.5 * h * k1_vz2);
    k2_x3 = v_x3 + (0.5 * h * k1_vx3);
    k2_y3 = v_y3 + (0.5 * h * k1_vy3);
    k2_z3 = v_z3 + (0.5 * h * k1_vz3);


    k2_vx1 = - (G * m2 * ((x1 + 0.5 * h * k1_x1) - (x2 + 0.5 * h * k1_x2))) / (Math.pow(Math.pow((x2 + 0.5 * h * k1_x2) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y2 + 0.5 * h * k1_y2) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z2 + 0.5 * h * k1_z2) - (z1 + 0.5 * h * k1_z1), 2), 1.5))
             - (G * m3 * ((x1 + 0.5 * h * k1_x1) - (x3 + 0.5 * h * k1_x3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z1 + 0.5 * h * k1_z1), 2), 1.5));
    k2_vy1 = - (G * m2 * ((y1 + 0.5 * h * k1_y1) - (y2 + 0.5 * h * k1_y2))) / (Math.pow(Math.pow((x2 + 0.5 * h * k1_x2) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y2 + 0.5 * h * k1_y2) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z2 + 0.5 * h * k1_z2) - (z1 + 0.5 * h * k1_z1), 2), 1.5))
             - (G * m3 * ((y1 + 0.5 * h * k1_y1) - (y3 + 0.5 * h * k1_y3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z1 + 0.5 * h * k1_z1), 2), 1.5));
    k2_vz1 = - (G * m2 * ((z1 + 0.5 * h * k1_z1) - (z2 + 0.5 * h * k1_z2))) / (Math.pow(Math.pow((x2 + 0.5 * h * k1_x2) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y2 + 0.5 * h * k1_y2) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z2 + 0.5 * h * k1_z2) - (z1 + 0.5 * h * k1_z1), 2), 1.5))
             - (G * m3 * ((z1 + 0.5 * h * k1_z1) - (z3 + 0.5 * h * k1_z3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z1 + 0.5 * h * k1_z1), 2), 1.5));
    k2_vx2 = - (G * m1 * ((x2 + 0.5 * h * k1_x2) - (x1 + 0.5 * h * k1_x1))) / (Math.pow(Math.pow((x2 + 0.5 * h * k1_x2) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y2 + 0.5 * h * k1_y2) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z2 + 0.5 * h * k1_z2) - (z1 + 0.5 * h * k1_z1), 2), 1.5))
             - (G * m3 * ((x2 + 0.5 * h * k1_x2) - (x3 + 0.5 * h * k1_x3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x2 + 0.5 * h * k1_x2), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y2 + 0.5 * h * k1_y2), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z2 + 0.5 * h * k1_z2), 2), 1.5));
    k2_vy2 = - (G * m1 * ((y2 + 0.5 * h * k1_y2) - (y1 + 0.5 * h * k1_y1))) / (Math.pow(Math.pow((x2 + 0.5 * h * k1_x2) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y2 + 0.5 * h * k1_y2) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z2 + 0.5 * h * k1_z2) - (z1 + 0.5 * h * k1_z1), 2), 1.5))
             - (G * m3 * ((y2 + 0.5 * h * k1_y2) - (y3 + 0.5 * h * k1_y3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x2 + 0.5 * h * k1_x2), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y2 + 0.5 * h * k1_y2), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z2 + 0.5 * h * k1_z2), 2), 1.5));
    k2_vz2 = - (G * m1 * ((z2 + 0.5 * h * k1_z2) - (z1 + 0.5 * h * k1_z1))) / (Math.pow(Math.pow((x2 + 0.5 * h * k1_x2) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y2 + 0.5 * h * k1_y2) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z2 + 0.5 * h * k1_z2) - (z1 + 0.5 * h * k1_z1), 2), 1.5))
             - (G * m3 * ((z2 + 0.5 * h * k1_z2) - (z3 + 0.5 * h * k1_z3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x2 + 0.5 * h * k1_x2), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y2 + 0.5 * h * k1_y2), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z2 + 0.5 * h * k1_z2), 2), 1.5));
    k2_vx3 = - (G * m1 * ((x3 + 0.5 * h * k1_x3) - (x1 + 0.5 * h * k1_x1))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z1 + 0.5 * h * k1_z1), 2), 1.5))
             - (G * m2 * ((x3 + 0.5 * h * k1_x3) - (x2 + 0.5 * h * k1_x2))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x2 + 0.5 * h * k1_x2), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y2 + 0.5 * h * k1_y2), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z2 + 0.5 * h * k1_z2), 2), 1.5));
    k2_vy3 = - (G * m1 * ((y3 + 0.5 * h * k1_y3) - (y1 + 0.5 * h * k1_y1))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z1 + 0.5 * h * k1_z1), 2), 1.5))
             - (G * m2 * ((y3 + 0.5 * h * k1_y3) - (y2 + 0.5 * h * k1_y2))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x2 + 0.5 * h * k1_x2), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y2 + 0.5 * h * k1_y2), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z2 + 0.5 * h * k1_z2), 2), 1.5));
    k2_vz3 = - (G * m1 * ((z3 + 0.5 * h * k1_z3) - (z1 + 0.5 * h * k1_z1))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x1 + 0.5 * h * k1_x1), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y1 + 0.5 * h * k1_y1), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z1 + 0.5 * h * k1_z1), 2), 1.5))
             - (G * m2 * ((z3 + 0.5 * h * k1_z3) - (z2 + 0.5 * h * k1_z2))) / (Math.pow(Math.pow((x3 + 0.5 * h * k1_x3) - (x2 + 0.5 * h * k1_x2), 2) + Math.pow((y3 + 0.5 * h * k1_y3) - (y2 + 0.5 * h * k1_y2), 2) + Math.pow((z3 + 0.5 * h * k1_z3) - (z2 + 0.5 * h * k1_z2), 2), 1.5));

    //k3
    k3_x1 = v_x1 + 0.5 * h * k2_vx1;
    k3_y1 = v_y1 + 0.5 * h * k2_vy1;
    k3_z1 = v_z1 + 0.5 * h * k2_vz1;
    k3_x2 = v_x2 + 0.5 * h * k2_vx2;
    k3_y2 = v_y2 + 0.5 * h * k2_vy2;
    k3_z2 = v_z2 + 0.5 * h * k2_vz2;
    k3_x3 = v_x3 + 0.5 * h * k2_vx3;
    k3_y3 = v_y3 + 0.5 * h * k2_vy3;
    k3_z3 = v_z3 + 0.5 * h * k2_vz3;

    k3_vx1 = - (G * m2 * ((x1 + 0.5 * h * k2_x1) - (x2 + 0.5 * h * k2_x2))) / (Math.pow(Math.pow((x2 + 0.5 * h * k2_x2) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y2 + 0.5 * h * k2_y2) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z2 + 0.5 * h * k2_z2) - (z1 + 0.5 * h * k2_z1), 2), 1.5))
             - (G * m3 * ((x1 + 0.5 * h * k2_x1) - (x3 + 0.5 * h * k2_x3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z1 + 0.5 * h * k2_z1), 2), 1.5));
    k3_vy1 = - (G * m2 * ((y1 + 0.5 * h * k2_y1) - (y2 + 0.5 * h * k2_y2))) / (Math.pow(Math.pow((x2 + 0.5 * h * k2_x2) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y2 + 0.5 * h * k2_y2) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z2 + 0.5 * h * k2_z2) - (z1 + 0.5 * h * k2_z1), 2), 1.5))
             - (G * m3 * ((y1 + 0.5 * h * k2_y1) - (y3 + 0.5 * h * k2_y3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z1 + 0.5 * h * k2_z1), 2), 1.5));
    k3_vz1 = - (G * m2 * ((z1 + 0.5 * h * k2_z1) - (z2 + 0.5 * h * k2_z2))) / (Math.pow(Math.pow((x2 + 0.5 * h * k2_x2) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y2 + 0.5 * h * k2_y2) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z2 + 0.5 * h * k2_z2) - (z1 + 0.5 * h * k2_z1), 2), 1.5))
             - (G * m3 * ((z1 + 0.5 * h * k2_z1) - (z3 + 0.5 * h * k2_z3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z1 + 0.5 * h * k2_z1), 2), 1.5));
    k3_vx2 = - (G * m1 * ((x2 + 0.5 * h * k2_x2) - (x1 + 0.5 * h * k2_x1))) / (Math.pow(Math.pow((x2 + 0.5 * h * k2_x2) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y2 + 0.5 * h * k2_y2) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z2 + 0.5 * h * k2_z2) - (z1 + 0.5 * h * k2_z1), 2), 1.5))
             - (G * m3 * ((x2 + 0.5 * h * k2_x2) - (x3 + 0.5 * h * k2_x3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x2 + 0.5 * h * k2_x2), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y2 + 0.5 * h * k2_y2), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z2 + 0.5 * h * k2_z2), 2), 1.5));
    k3_vy2 = - (G * m1 * ((y2 + 0.5 * h * k2_y2) - (y1 + 0.5 * h * k2_y1))) / (Math.pow(Math.pow((x2 + 0.5 * h * k2_x2) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y2 + 0.5 * h * k2_y2) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z2 + 0.5 * h * k2_z2) - (z1 + 0.5 * h * k2_z1), 2), 1.5))
             - (G * m3 * ((y2 + 0.5 * h * k2_y2) - (y3 + 0.5 * h * k2_y3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x2 + 0.5 * h * k2_x2), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y2 + 0.5 * h * k2_y2), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z2 + 0.5 * h * k2_z2), 2), 1.5));
    k3_vz2 = - (G * m1 * ((z2 + 0.5 * h * k2_z2) - (z1 + 0.5 * h * k2_z1))) / (Math.pow(Math.pow((x2 + 0.5 * h * k2_x2) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y2 + 0.5 * h * k2_y2) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z2 + 0.5 * h * k2_z2) - (z1 + 0.5 * h * k2_z1), 2), 1.5))
             - (G * m3 * ((z2 + 0.5 * h * k2_z2) - (z3 + 0.5 * h * k2_z3))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x2 + 0.5 * h * k2_x2), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y2 + 0.5 * h * k2_y2), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z2 + 0.5 * h * k2_z2), 2), 1.5));
    k3_vx3 = - (G * m1 * ((x3 + 0.5 * h * k2_x3) - (x1 + 0.5 * h * k2_x1))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z1 + 0.5 * h * k2_z1), 2), 1.5))
             - (G * m2 * ((x3 + 0.5 * h * k2_x3) - (x2 + 0.5 * h * k2_x2))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x2 + 0.5 * h * k2_x2), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y2 + 0.5 * h * k2_y2), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z2 + 0.5 * h * k2_z2), 2), 1.5));
    k3_vy3 = - (G * m1 * ((y3 + 0.5 * h * k2_y3) - (y1 + 0.5 * h * k2_y1))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z1 + 0.5 * h * k2_z1), 2), 1.5))
             - (G * m2 * ((y3 + 0.5 * h * k2_y3) - (y2 + 0.5 * h * k2_y2))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x2 + 0.5 * h * k2_x2), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y2 + 0.5 * h * k2_y2), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z2 + 0.5 * h * k2_z2), 2), 1.5));
    k3_vz3 = - (G * m1 * ((z3 + 0.5 * h * k2_z3) - (z1 + 0.5 * h * k2_z1))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x1 + 0.5 * h * k2_x1), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y1 + 0.5 * h * k2_y1), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z1 + 0.5 * h * k2_z1), 2), 1.5))
             - (G * m2 * ((z3 + 0.5 * h * k2_z3) - (z2 + 0.5 * h * k2_z2))) / (Math.pow(Math.pow((x3 + 0.5 * h * k2_x3) - (x2 + 0.5 * h * k2_x2), 2) + Math.pow((y3 + 0.5 * h * k2_y3) - (y2 + 0.5 * h * k2_y2), 2) + Math.pow((z3 + 0.5 * h * k2_z3) - (z2 + 0.5 * h * k2_z2), 2), 1.5));

    //k4
    k4_x1 = v_x1 + h * k3_vx1;
    k4_y1 = v_y1 + h * k3_vy1;
    k4_z1 = v_z1 + h * k3_vz1;
    k4_x2 = v_x2 + h * k3_vx2;
    k4_y2 = v_y2 + h * k3_vy2;
    k4_z2 = v_z2 + h * k3_vz2;
    k4_x3 = v_x3 + h * k3_vx3;
    k4_y3 = v_y3 + h * k3_vy3;
    k4_z3 = v_z3 + h * k3_vz3;

    k4_vx1 = - (G * m2 * ((x1 + h * k3_x1) - (x2 + h * k3_x2))) / (Math.pow(Math.pow((x2 + h * k3_x2) - (x1 + h * k3_x1), 2) + Math.pow((y2 + h * k3_y2) - (y1 + h * k3_y1), 2) + Math.pow((z2 + h * k3_z2) - (z1 + h * k3_z1), 2), 1.5))
             - (G * m3 * ((x1 + h * k3_x1) - (x3 + h * k3_x3))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x1 + h * k3_x1), 2) + Math.pow((y3 + h * k3_y3) - (y1 + h * k3_y1), 2) + Math.pow((z3 + h * k3_z3) - (z1 + h * k3_z1), 2), 1.5));
    k4_vy1 = - (G * m2 * ((y1 + h * k3_y1) - (y2 + h * k3_y2))) / (Math.pow(Math.pow((x2 + h * k3_x2) - (x1 + h * k3_x1), 2) + Math.pow((y2 + h * k3_y2) - (y1 + h * k3_y1), 2) + Math.pow((z2 + h * k3_z2) - (z1 + h * k3_z1), 2), 1.5))
             - (G * m3 * ((y1 + h * k3_y1) - (y3 + h * k3_y3))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x1 + h * k3_x1), 2) + Math.pow((y3 + h * k3_y3) - (y1 + h * k3_y1), 2) + Math.pow((z3 + h * k3_z3) - (z1 + h * k3_z1), 2), 1.5));
    k4_vz1 = - (G * m2 * ((z1 + h * k3_z1) - (z2 + h * k3_z2))) / (Math.pow(Math.pow((x2 + h * k3_x2) - (x1 + h * k3_x1), 2) + Math.pow((y2 + h * k3_y2) - (y1 + h * k3_y1), 2) + Math.pow((z2 + h * k3_z2) - (z1 + h * k3_z1), 2), 1.5))
             - (G * m3 * ((z1 + h * k3_z1) - (z3 + h * k3_z3))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x1 + h * k3_x1), 2) + Math.pow((y3 + h * k3_y3) - (y1 + h * k3_y1), 2) + Math.pow((z3 + h * k3_z3) - (z1 + h * k3_z1), 2), 1.5));
    k4_vx2 = - (G * m1 * ((x2 + h * k3_x2) - (x1 + h * k3_x1))) / (Math.pow(Math.pow((x2 + h * k3_x2) - (x1 + h * k3_x1), 2) + Math.pow((y2 + h * k3_y2) - (y1 + h * k3_y1), 2) + Math.pow((z2 + h * k3_z2) - (z1 + h * k3_z1), 2), 1.5))
             - (G * m3 * ((x2 + h * k3_x2) - (x3 + h * k3_x3))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x2 + h * k3_x2), 2) + Math.pow((y3 + h * k3_y3) - (y2 + h * k3_y2), 2) + Math.pow((z3 + h * k3_z3) - (z2 + h * k3_z2), 2), 1.5));
    k4_vy2 = - (G * m1 * ((y2 + h * k3_y2) - (y1 + h * k3_y1))) / (Math.pow(Math.pow((x2 + h * k3_x2) - (x1 + h * k3_x1), 2) + Math.pow((y2 + h * k3_y2) - (y1 + h * k3_y1), 2) + Math.pow((z2 + h * k3_z2) - (z1 + h * k3_z1), 2), 1.5))
             - (G * m3 * ((y2 + h * k3_y2) - (y3 + h * k3_y3))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x2 + h * k3_x2), 2) + Math.pow((y3 + h * k3_y3) - (y2 + h * k3_y2), 2) + Math.pow((z3 + h * k3_z3) - (z2 + h * k3_z2), 2), 1.5));
    k4_vz2 = - (G * m1 * ((z2 + h * k3_z2) - (z1 + h * k3_z1))) / (Math.pow(Math.pow((x2 + h * k3_x2) - (x1 + h * k3_x1), 2) + Math.pow((y2 + h * k3_y2) - (y1 + h * k3_y1), 2) + Math.pow((z2 + h * k3_z2) - (z1 + h * k3_z1), 2), 1.5))
             - (G * m3 * ((z2 + h * k3_z2) - (z3 + h * k3_z3))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x2 + h * k3_x2), 2) + Math.pow((y3 + h * k3_y3) - (y2 + h * k3_y2), 2) + Math.pow((z3 + h * k3_z3) - (z2 + h * k3_z2), 2), 1.5));
    k4_vx3 = - (G * m1 * ((x3 + h * k3_x3) - (x1 + h * k3_x1))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x1 + h * k3_x1), 2) + Math.pow((y3 + h * k3_y3) - (y1 + h * k3_y1), 2) + Math.pow((z3 + h * k3_z3) - (z1 + h * k3_z1), 2), 1.5))
             - (G * m2 * ((x3 + h * k3_x3) - (x2 + h * k3_x2))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x2 + h * k3_x2), 2) + Math.pow((y3 + h * k3_y3) - (y2 + h * k3_y2), 2) + Math.pow((z3 + h * k3_z3) - (z2 + h * k3_z2), 2), 1.5));
    k4_vy3 = - (G * m1 * ((y3 + h * k3_y3) - (y1 + h * k3_y1))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x1 + h * k3_x1), 2) + Math.pow((y3 + h * k3_y3) - (y1 + h * k3_y1), 2) + Math.pow((z3 + h * k3_z3) - (z1 + h * k3_z1), 2), 1.5))
             - (G * m2 * ((y3 + h * k3_y3) - (y2 + h * k3_y2))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x2 + h * k3_x2), 2) + Math.pow((y3 + h * k3_y3) - (y2 + h * k3_y2), 2) + Math.pow((z3 + h * k3_z3) - (z2 + h * k3_z2), 2), 1.5));
    k4_vz3 = - (G * m1 * ((z3 + h * k3_z3) - (z1 + h * k3_z1))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x1 + h * k3_x1), 2) + Math.pow((y3 + h * k3_y3) - (y1 + h * k3_y1), 2) + Math.pow((z3 + h * k3_z3) - (z1 + h * k3_z1), 2), 1.5))
             - (G * m2 * ((z3 + h * k3_z3) - (z2 + h * k3_z2))) / (Math.pow(Math.pow((x3 + h * k3_x3) - (x2 + h * k3_x2), 2) + Math.pow((y3 + h * k3_y3) - (y2 + h * k3_y2), 2) + Math.pow((z3 + h * k3_z3) - (z2 + h * k3_z2), 2), 1.5));


    //incremento

    x1 = x1 + (h / 6) * (k1_x1 + (2 * k2_x1) + (2 * k3_x1) + k4_x1);
    y1 = y1 + (h / 6) * (k1_y1 + (2 * k2_y1) + (2 * k3_y1) + k4_y1);
    z1 = z1 + (h / 6) * (k1_z1 + (2 * k2_z1) + (2 * k3_z1) + k4_z1);
    x2 = x2 + (h / 6) * (k1_x2 + (2 * k2_x2) + (2 * k3_x2) + k4_x2);
    y2 = y2 + (h / 6) * (k1_y2 + (2 * k2_y2) + (2 * k3_y2) + k4_y2);
    z2 = z2 + (h / 6) * (k1_z2 + (2 * k2_z2) + (2 * k3_z2) + k4_z2);
    x3 = x3 + (h / 6) * (k1_x3 + (2 * k2_x3) + (2 * k3_x3) + k4_x3);
    y3 = y3 + (h / 6) * (k1_y3 + (2 * k2_y3) + (2 * k3_y3) + k4_y3);
    z3 = z3 + (h / 6) * (k1_z3 + (2 * k2_z3) + (2 * k3_z3) + k4_z3);

    v_x1 = v_x1 + (h / 6) * (k1_vx1 + (2 * k2_vx1) + (2 * k3_vx1) + k4_vx1);
    v_y1 = v_y1 + (h / 6) * (k1_vy1 + (2 * k2_vy1) + (2 * k3_vy1) + k4_vy1);
    v_z1 = v_z1 + (h / 6) * (k1_vz1 + (2 * k2_vz1) + (2 * k3_vz1) + k4_vz1);
    v_x2 = v_x2 + (h / 6) * (k1_vx2 + (2 * k2_vx2) + (2 * k3_vx2) + k4_vx2);
    v_y2 = v_y2 + (h / 6) * (k1_vy2 + (2 * k2_vy2) + (2 * k3_vy2) + k4_vy2);
    v_z2 = v_z2 + (h / 6) * (k1_vz2 + (2 * k2_vz2) + (2 * k3_vz2) + k4_vz2);
    v_x3 = v_x3 + (h / 6) * (k1_vx3 + (2 * k2_vx3) + (2 * k3_vx3) + k4_vx3);
    v_y3 = v_y3 + (h / 6) * (k1_vy3 + (2 * k2_vy3) + (2 * k3_vy3) + k4_vy3);
    v_z3 = v_z3 + (h / 6) * (k1_vz3 + (2 * k2_vz3) + (2 * k3_vz3) + k4_vz3);

    t = t + h; 
}
