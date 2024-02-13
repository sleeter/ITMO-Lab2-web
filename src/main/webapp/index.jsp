<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>lab2</title>
    <link rel="stylesheet" href="CSS/style.css">
</head>
<body>
<div class="header">
    <a href="https://github.com/sleeter" target="_blank"><img alt="Логотип" src="logo.png"></a>
    <div>
                <span>
                    <a href="https://t.me/sleeter" target="_blank">Бадамханов Тимур P3207</a>
                </span>
        <span>
                    <a href="https://se.ifmo.ru/courses/web" target="_blank">Вариант 17121</a>
                </span>
    </div>
</div>
<div class="navigation">
    <p>Добро пожаловать на сайт 1TimBet</p>
</div>
<main>
    <div id="canvas-form-wrapper">
        <div id="canvas-wrapper">
            <canvas id="drawLine" width="600" height="600"></canvas></div>

        <div id="form-wrapper">
            <div id="input-wrapper">
                <div class="wrappers">
                    <label for="x_coords">Координата X:</label>
                    <input type="text" id="x_coords" min="-2" max="2" name="x_coords" class="my-input" oninput="change_input_field(this, -1.99999999, 1.99999999, 0)" placeholder="X (-2; 2)"/>
                </div>

                <div class="wrappers">
                    <label for="y_coords">Координата Y:</label>
                    <input type="text" id="y_coords" min="-5" max="5" name="y_coords" class="my-input" oninput="change_input_field(this, -4.99999999, 4.99999999, 1)" placeholder="Y (-5; 5)"/>
                </div>

                <div id="r-wrapper" class="wrappers">
<%--                    <label for="size_r">Параметр R:</label>--%>
<%--                    <select name="size_r" id="size_r" class="my-select">--%>
<%--                        <option value="1">1</option>--%>
<%--                        <option value="1.5">1.5</option>--%>
<%--                        <option value="2">2</option>--%>
<%--                        <option value="2.5">2.5</option>--%>
<%--                        <option value="3" selected>3</option>--%>
<%--                    </select>--%>
                    <label>Параметр R:</label>
                    <label for="r1.0" class="container">1.0
                        <input type="radio" id="r1.0" name="r" value="1.0" onclick="set_R_value(value)" />
                    </label>
                    <label for="r1.5" class="container">1.5
                        <input type="radio" id="r1.5" name="r" value="1.5" onclick="set_R_value(value)" />
                    </label>
                    <label for="r2.0" class="container">2.0
                        <input type="radio" id="r2.0" name="r" value="2.0" onclick="set_R_value(value)" />
                    </label>
                    <label for="r2.5" class="container">2.5
                        <input type="radio" id="r2.5" name="r" value="2.5" onclick="set_R_value(value)" />
                    </label>
                    <label for="r3.0" class="container">3.0
                        <input type="radio" id="r3.0" name="r" value="3.0" onclick="set_R_value(value)" />
                    </label>
                </div>
                <div id="submit-history">
                <div id="submit-wrapper">
                    <button type="submit" class="btn" id="submit" onclick="request_to_servlet()">Отправить</button>
                </div>
                <div id="history-wrapper">
                    <button class="btn" id="clean" onclick="clear_table()">Очистить</button>
                </div>
                </div>
                <h5 id="form_error"></h5>
            </div>
        </div>

        <div class="table-container">
            <div class="table">
                <table id="results" class="table-check">
<%--                    <thead>--%>
                    <tr class="table-header">
                        <th>X</th>
                        <th>Y</th>
                        <th>R</th>
                        <th>Текущее время</th>
                        <th>Время работы программы</th>
                        <th>Результат</th>
                    </tr>
<%--                    </thead>--%>
                    <%--@elvariable id="dots" type="model.DotCollectionManager"--%>
                    <c:forEach items="${dots.collection}" var="col">
                        <tr>
                            <td>${col.x.toString().format("%.4f", col.x)}</td>
                            <td>${col.y.toString().format("%.4f", col.y)}</td>
                            <td>${col.r.toString().trim().format("%.4f", col.r)}</td>
                            <td>${col.time.toString()}</td>
                            <td>${col.scriptTime.toString()}</td>
                            <td>${col.status.toString()}</td>
                        </tr>
                    </c:forEach>
                </table>
            </div>
        </div>
    </div>
</main>
<div class="footer">
    <small>
            Проект доступен с открытым исходным кодом на условиях Лицензии CC BY-NC-SA 4.0. Авторские права 2023 Бадамханов Тимур
    </small>
</div>
<script src="JS/script.js"></script>
</body>
</html>