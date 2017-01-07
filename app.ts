/*
 Словарь системы:
 Клиентская часть (client side) - веб страница сформированная на сервере или SPA или мобильное приложение.
 Серверная часть (server side) - веб сервер обрабатывающий запросы с веб-страниц или с SPA или с мобильного приложения.
 Исходные данные (input data):
 размеры которые нужно нарезать (bars);
 минимальная длина заготовки, которую можно вырезать (minBar)
 размер цельной заготовки (fullBar);
 ширина реза пилы (sawWidth);
 минимальный деловой остаток (minWaste) - минимальный остаток который есть смысл ложить на склад (stock),
 в надежде, что из него в следующие подходы можно будет вырезать кусок;
 остатки от предыдущих порезок (remnants)

 Программа расчета порезки, состоит из двух "частей".
 Первая - клиент-серверная часть приема данных для расчета,
 из анализа, сохранения их в базу данных, постановки в очередь.
 Анализ данных состоит в анализе:
 валидности данных в том числе минимальном необходимом количестве данных, чтобы задачу не имело смысла решать вручную;
 просмотр данных уже существующих расчетов на предмет не выполнялся ли этот расчет ранее;
 оценка возможности расчета путем полного перебора;
 Вторая часть - программа расчета, берущая задачи из очереди и выполняющая их расчет.

 Ввести исходные данные с клиентской части.
 Исходные данные:
 размеры которые нужно нарезать (bars, мм, Array<Integer>);
 минимальная длина заготовки, которую можно вырезать (minBar, мм, Integer)
 размер цельной заготовки (fullBar, мм, Integer);
 ширина реза пилы (sawWidth, мм, Integer);
 минимальный деловой остаток (minWaste, мм, Integer) - минимальный остаток который есть смысл ложить на склад (stock),
 в надежде, что из него в следующие подходы можно будет вырезать кусок;
 остатки от предыдущих порезок (remnants, мм, Array<Integer>)

 Проверяем входные данные:
 Количество размеров, которые нужно нарезать не менее 20?
 Все числа положительные целые;
 Остатков (remnants) может не быть;
 Каждый размер для порезки не может быть меньше чем минимальная длина заготовки (minBar) и
 больше размера цельной заготовки (fullBar) или максимального остатка.
 Минимальная длина заготовки, которую можно вырезать (minAllowBar) должна быть меньше размера
 цельной заготовки (fullBar), при размере в половину цельной заготовки и больше просить подтвердить.
 Ширина реза пилы не должна быть больше размера цельной заготовки (fullBar) и
 при размере больше 9 мм просить подтвердить?
 Минимальный деловой остаток (minAllowWaste) должен быть меньше размера цельной заготовки (fullBar) при размере
 большем половины цельной заготовки просить подтвердить.

 Дальнейший анализ:
 Если все размеры равны или больше половины при сложении с шириной реза пилы

 Варианты расчета:
 Жесткий приоритет остатков (должны быть остатки, если нет остатков вернуться с предупреждением что их нет) - сначала
 режутся остатки, а затем для оставшихся размеров берутся целые заготовки.
 ? Приоритет остатков (должны быть остатки, если нет остаткой вернутьс с предупреждением что их нет) - сначала режутся
 остатки, а затем для оставшихся размеров берутся целые заготовки, но для остатков учитывается процент отхода, если
 он выходит ?сильно большой?, то остаток для которого он вышел сильно большой не берет участия в порезке.
 ? Приоритет минимума отходов - порезка считается сразу для остатков и цельных заготовок для получения оптимальной порезки.

 За сколько времени при каких условиях можно осуществить полный перебор?
 */

import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as nunjucks from "nunjucks";
import * as favicon from "serve-favicon";
import * as sassMiddleware from "node-sass-middleware";
import * as routes from "./routes/index";
import * as users from "./routes/users";
import {Error} from "./Error/Error";
import Database from "./db_layer/Database";

// const config = require('config');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'templates'));
// app.set('view engine', 'nunjucks');

nunjucks.configure('templates', {
  autoescape: true,
  express: app
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

// TODO var numbers = '[stuff ids="7,80"]'.match(/\d+/g);

// Err what to do?
Database.connect();

app.use('/', routes);
app.use('/users', users);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
  let err: Error = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req: express.Request, res: express.Response, next: express.NextFunction) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;