let canvas = document.getElementById('drawLine');
console.log(canvas);
let ctx = canvas.getContext('2d');
ctx.font = "15px calibre";
ctx.lineWidth = "2";
let min_x = -1.99999999, max_x = 1.99999999, min_y = -4.99999999, max_y = 4.99999999;

class Grid {
    constructor(size_x, size_y, r) {
        this.size_x = size_x;
        this.size_y = size_y;
        this.r = r;
        this.raz = this.size_x / 60;
        this.need_cross = true;
        this.point_coords = [-this.raz, -this.raz, 2];
        this.scalex = 7; // кол-во ступеней в сетке
        this.scaley = 11;
        this.ssx = this.size_x / this.scalex;
        this.ssy = this.size_y / this.scaley;
        this.cursor_in_good_zone = false;
        this.mouse_on_canvas = false;
        this.mouse_coords = [-10, -10];
    }

    draw() {
        this.stroke_panel();
        this.draw_primitives();
        this.draw_grid();
        if (this.mouse_on_canvas) {
            this.drawCross();
        }
        this.drawPoint()
        this.draw_all_points_from_cache()
    }

    drawPoint() {
        ctx.beginPath()
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = '#ffffff'
        if (this.point_coords[2] === 0) {
            ctx.fillStyle = "#f00";
        } else if (this.point_coords[2] === 1) {
            ctx.strokeStyle = '#000000'
            ctx.fillStyle = "#ffffff";
        }

        ctx.arc(this.point_coords[0], this.point_coords[1], this.raz / 1.5, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#000000'
        ctx.fillStyle = "#000";
    }

    drawCross() {
        let x = this.mouse_coords[0], y = this.mouse_coords[1];
        ctx.beginPath()

        let mini = this.trans_coords_to_canvas(min_x, min_y), maxi = this.trans_coords_to_canvas(max_x, max_y);
        ctx.moveTo(mini[0], mini[1]);
        ctx.lineTo(mini[0], maxi[1]);
        ctx.lineTo(maxi[0], maxi[1]);
        ctx.lineTo(maxi[0], mini[1]);
        ctx.lineTo(mini[0], mini[1]);

        this.cursor_in_good_zone = x > mini[0] && x < maxi[0] && y > maxi[1] && y < mini[1];
    }

    draw_primitives() {
        let x, y, c = this.trans_coords(0, 0);
        x = c[0]; y = c[1];

        // Четверть круг
        ctx.beginPath()
        ctx.ellipse(x, y, this.size_x / this.scalex * this.r, this.size_x / this.scaley * this.r, 0, Math.PI, Math.PI*3/2,false);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.5;
        ctx.lineTo(x, y);
        ctx.fill();

        // Прямоугольник
        ctx.beginPath()
        ctx.moveTo(x, y);
        c = this.trans_coords(0, -this.size_y / this.scaley * this.r / 2);
        ctx.lineTo(c[0], c[1]);
        c = this.trans_coords(this.size_y / this.scalex * this.r, -this.size_y / this.scaley * this.r / 2)
        ctx.lineTo(c[0], c[1]);
        c = this.trans_coords(this.size_y / this.scalex * this.r, 0)
        ctx.lineTo(c[0], c[1]);
        ctx.fill();

        // Треугольник
        ctx.beginPath()
        ctx.moveTo(x, y);
        c = this.trans_coords(-this.size_x / this.scalex * this.r, 0);
        ctx.lineTo(c[0], c[1]);
        c = this.trans_coords(0, this.size_y / this.scaley / 2 * this.r);
        ctx.lineTo(c[0], c[1]);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.fillStyle = "#000000";
    }

    draw_grid() {
        ctx.fillStyle = '#ffffff';
        // Координатная сетка
        ctx.beginPath()
        ctx.fillText('Y', this.size_x / 2 + this.raz, 20);
        ctx.moveTo(this.size_x / 2, 0);
        ctx.lineTo(this.size_x / 2, this.size_y);
        ctx.fillText('X', this.size_x - 20, this.size_y / 2 - this.raz - 5);
        ctx.moveTo(0, this.size_y / 2);
        ctx.lineTo(this.size_x, this.size_y / 2);

        // Стрелочки сетки
        ctx.moveTo(this.size_x / 2, 0);
        ctx.lineTo(this.size_x / 2 - this.raz, this.raz * 2);
        ctx.moveTo(this.size_x / 2, 0);
        ctx.lineTo(this.size_x / 2 + this.raz, this.raz * 2);
        ctx.moveTo(this.size_x, this.size_y / 2);
        ctx.lineTo(this.size_x - this.raz * 2, this.size_y / 2 - this.raz);
        ctx.moveTo(this.size_x, this.size_y / 2);
        ctx.lineTo(this.size_x - this.raz * 2, this.size_y / 2 + this.raz);


        // Разметка сетки
        // Горизонтальная
        let c, x, y;
        for (let i = parseInt(-this.scalex + 0.5); i < this.scalex; i++) {
            if (i === 0) {
                continue;
            }
            c = this.trans_coords(this.size_x / this.scalex * i / 2, 0);
            x = c[0];
            y = c[1];
            ctx.fillText(i / 2, x - String(i / 2).length * 5, y - this.raz - 3);
            ctx.moveTo(x, y - this.raz);
            ctx.lineTo(x, y + this.raz);
        }

        // Вертикальная
        for (let i = parseInt(-this.scaley + 0.5); i < this.scaley; i++) {
            if (i === 0) {
                continue
            }
            c = this.trans_coords(0, -this.size_y / this.scaley * i / 2);
            x = c[0];
            y = c[1];
            ctx.fillText(i / 2, x + this.raz - 47, y + 5);
            ctx.moveTo(x - this.raz, y);
            ctx.lineTo(x + this.raz, y);
        }
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = "#ffffff"
        ctx.stroke();
        ctx.strokeStyle = "#000000"
    }

    draw_all_points_from_cache() {
        localStorage.getItem("data").split("<tr>").forEach(val => {
            let res = val.replaceAll("</p></td>", "").split("<td><p class='crop'>")
            if (res.length > 1 && res[3] === this.r) {
                this.draw_point(res[1], res[2], res[4] === "Hit" ? 1 : 0)
            }
        })
    }

    draw_point(x, y, s) {
        ctx.beginPath()
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = '#ffffff'
        if (s === 0) {
            ctx.fillStyle = "#f00";
        } else if (s === 1) {
            ctx.strokeStyle = '#000000'
            ctx.fillStyle = "#ffffff";
        }

        let r = this.trans_coords_to_canvas(x, y)
        ctx.arc(r[0], r[1], this.raz / 1.5, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#000000'
        ctx.fillStyle = "#000";
    }

    trans_coords(x, y) {
        return [this.size_x / 2 + x, this.size_y / 2 + y];
    }

    stroke_panel() {
        ctx.beginPath()
        ctx.moveTo(0, 0);
        ctx.lineTo(this.size_x, 0);
        ctx.lineTo(this.size_x, this.size_y);
        ctx.lineTo(0, this.size_y);
        ctx.lineTo(0, 0);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.fillStyle = "#000000";
    }

    trans_coords_to_canvas(x_coords, y_coords) {
        return [x_coords * this.ssx + this.size_x / 2, grid.size_y - (y_coords * this.ssy + grid.size_y / 2)];
    }

    trans_canvas_to_coords(x_canvas, y_canvas) {
        return [(x_canvas - this.size_x / 2) / this.ssx, -(y_canvas - this.size_y / 2) / this.ssy]
    }
}

canvas.onmousemove = function (evt) {
    evt = evt || window.event;
    let rect = this.getBoundingClientRect(), x = evt.clientX - rect.left, y = evt.clientY - rect.top;
    grid.mouse_on_canvas = true;
    grid.mouse_coords = [x, y];
    grid.draw();
}

canvas.onclick = function (evt) {
    if (grid.cursor_in_good_zone) {
        let rect = this.getBoundingClientRect(), x = evt.clientX - rect.left, y = evt.clientY - rect.top;
        evt = evt || window.event;
        grid.need_cross = false;
        let res = grid.trans_canvas_to_coords(x, y);
        let x_coords = check_num_ogr(min_x, max_x, res[0]).toFixed(8), y_coords = check_num_ogr(min_y, max_y, res[1]).toFixed(8)
        document.getElementById("x_coords").value = x_coords;
        document.getElementById("y_coords").value = y_coords;
        res = grid.trans_coords_to_canvas(x_coords, y_coords);
        // grid.point_coords = [res[0], res[1], inPrimitive(x_coords, y_coords, grid.r)];
        grid.point_coords = [res[0], res[1], 2];
        grid.draw();
        document.getElementById("form_error").innerHTML = "";
    }
}

function change_input_field(elem, min_value, max_value, ty) {
    // console.log('qqqq', elem.value)
    elem.value = elem.value.replace(/[^(\.|\d|\-)]/g, '').slice(0, 15);
    // console.log("wwww", elem.value)
    if (elem.value.length>0) {
        if (!/\-?(\d+[\.]\d+|^\d+)/g.test(elem.value) || elem.value.match(/\./g) != null && elem.value.match(/\./g).length > 1 ||
            elem.value.match(/\-/g) != null && elem.value.match(/\-/g).length >= 1 || /^\-?(0{2,}|0+\d+)/g.test(elem.value)) {
            // console.log("1", elem.value)
            if (/^\-?(0{2,}|0+\d+)/g.test(elem.value)) {
                elem.value = parseFloat(elem.value);
            } else if (elem.value[0] === ".") {
                // console.log("2")
                elem.value = "0" + elem.value;
            } else if (elem.value.length > 1 && elem.value[1] === "." && elem.value[0] === "-") {
                // console.log("3")
                elem.value = elem.value.replace("-", "");
                elem.value = "-0" + elem.value;
            } else if (elem.value.match(/\./g) != null && elem.value.match(/\./g).length > 1) {
                // console.log("4")
                let loc = elem.value.split(".");
                elem.value = loc[0] + ".";
                delete loc[0];
                elem.value += loc.join("");
            } else if (elem.value.match(/\-/g) != null) {
                // console.log("5", elem.value)
                if (elem.value[0] !== "-") {
                    // console.log(elem.value, "!!!!!")
                    elem.value = elem.value.replace(/\-/g, "");
                } else if (elem.value.match(/\-/g).length > 1) {
                    // console.log(elem.value, "1_?????")
                    elem.value = "-" + elem.value.replace(/\-/g, "");
                    // console.log(elem.value, "2_?????")
                }
            }
        }
        // elem.value = check_num_ogr(min_value, max_value, elem.value);
        let coords = ty === 0 ? grid.trans_coords_to_canvas(elem.value, 0) : grid.trans_coords_to_canvas(0, elem.value);
        grid.point_coords[ty] = coords[ty];
        grid.point_coords[2] = 2;
        grid.draw();
        document.getElementById("form_error").innerHTML = "";
    }
}

function check_num_ogr(min_value, max_value, num) {
    if (num > max_value) {
        num = max_value;
    } else if (num < min_value) {
        num = min_value;
    }
    return num;
}

let r_value = NaN;
// function request_to_servlet() {
//     let x_value = document.getElementById("x_coords").value;
//     let y_value = document.getElementById("y_coords").value;
//     if (x_value.length === 0 || x_value === "-") {
//         document.getElementById("form_error").innerHTML = "Поле X должно быть заполнено";
//     } else if (y_value.length === 0 || y_value === "-") {
//         document.getElementById("form_error").innerHTML = "Поле Y должно быть заполнено";
//     } else if (x_value >= 2 || x_value <= -2) {
//         document.getElementById("form_error").innerHTML = "Значение поля X должно быть в (-2; 2)";
//     } else if (y_value >= 5 || y_value <= -5) {
//         document.getElementById("form_error").innerHTML = "Значение поля Y должно быть в (-5; 5)";
//     } else if (isNaN(r_value)) {
//         document.getElementById("form_error").innerHTML = "Значение R должно быть задано";
//     } else {
//
//         let xhr = new XMLHttpRequest();
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 4) {
//                 if (xhr.status === 200) {
//                     localStorage.setItem("data", xhr.responseText + localStorage.getItem("data"));
//                     document.getElementById("suda").innerHTML = localStorage.getItem("data");
//                     grid.point_coords[2] = (xhr.responseText.indexOf("Kill") === -1) ? 0 : 1;
//                     grid.draw();
//                 }
//             }
//         }
//         xhr.open('GET', '/ITMO-Lab2-web/ControllerServlet?x_coords=' + x_value + "&y_coords=" + y_value + "&size_r=" + grid.r, true);
//         xhr.send(null);
//     }
// }
function request_to_servlet() {
    if (validateXValue(getXValue()) && validateYValue(getYValue()) && validateRValue(getRValue())) {
        let x = getXValue();
        let y = getYValue();
        let r = getRValue();
        sendDataToServer(x, y, r);
    }
    else{
        console.log("something gone wrong! check values!");
    }
}
function getXValue(){
    return parseFloat(document.getElementById("X").value);
}

function getYValue(){
    let yValues = document.getElementById("Y");
    return parseFloat(yValues.options[yValues.selectedIndex].text);
}

function getRValue(){
    return parseFloat(document.getElementById("R").value);
}

function validateXValue(x){
    updateValidationPanel();
    let validationInfo = '';
    let isXCorrect = false;

    if (x != null && !isNaN(x)) {
        if ((x > -3) && (x < 5)) {
            isXCorrect = true;
        } else {
            validationInfo = "X должен быть в интервале (-3..5)!";
        }
    } else validationInfo = "Введите X!";

    addMessageToValidationPanel(validationInfo);
    return isXCorrect;
}

function validateYValue(y){
    updateValidationPanel();
    let validationInfo = '';
    let isYCorrect = false;

    if (y != null && !isNaN(y)) {
        isYCorrect = true;
    } else validationInfo = "Выберите Y!";

    addMessageToValidationPanel(validationInfo);
    return isYCorrect;
}

function validateRValue(r){

    updateValidationPanel();
    let validationInfo = '';
    let isRCorrect = false;

    if (r != null && !isNaN(r)) {
        if ((r > 2) && (r < 5)) {
            isRCorrect = true;
        } else {
            validationInfo = "R должен быть в интервале (2..5)!";
        }
    } else validationInfo = "Введите R!";

    addMessageToValidationPanel(validationInfo);
    return isRCorrect;
}
function sendDataToServer(x, y, r) {
    $.ajax({
        type: "GET",
        url: "ControllerServlet",
        dataType: "json",
        async: false,
        data: {
            "x_coords": x.toString().trim(), "y_coords": y.toString().trim(), "size_r": r.toString().trim(),
            "timezone": new Date().getTimezoneOffset()
        },
        success: function () {
            window.location.replace('result.jsp');
        },
        error: function (xhr, textStatus, err) {
            alert("readyState: " + xhr.readyState + "\n" +
                "responseText: " + xhr.responseText + "\n" +
                "status: " + xhr.status + "\n" +
                "text status: " + textStatus + "\n" +
                "error: " + err);
        }
    });
}

// function clear_table() {
//     localStorage.setItem("data", "");
//     document.getElementById("suda").innerHTML = "";
//     // grid.point_coords[2] = 2;
//     // grid.draw();
// }
function clear_table() {
    $.ajax({
        type: "DELETE",
        url: "controller-servlet",
        async: false,
        success: function () {
            $('#results').html(`<tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Текущее время</th>
                <th>Время работы программы (мкс)</th>
                <th>Результат</th>
            </tr>`);
        },
        error: function (xhr, textStatus, err) {
            alert("readyState: " + xhr.readyState + "\n" +
                "responseText: " + xhr.responseText + "\n" +
                "status: " + xhr.status + "\n" +
                "text status: " + textStatus + "\n" +
                "error: " + err);
        }
    })
}

canvas.onmouseleave = function (evt) {
    evt = evt || window.event;
    grid.mouse_on_canvas = false;
    grid.mouse_coords = [-10, -10];
    grid.draw();
}

// document.querySelector("select").addEventListener('change', function (e) {
//     grid.r = parseFloat(e.target.value);
//     grid.point_coords[2] = 2;
//     grid.draw();
// })

function set_R_value(value){
    r_value = parseFloat(value);
    grid.r = parseFloat(value);
    grid.point_coords[2] = 2;
    grid.draw();
    document.getElementById("form_error").innerHTML = "";
}

if (localStorage.getItem("data") == null) {
    localStorage.setItem("data", "");
}

document.getElementById("suda").innerHTML = localStorage.getItem("data");
let grid = new Grid(canvas.width, canvas.height, 3); // r - размер фигурки
grid.draw();