var pjs = new PointJS('2D', 1280 / 2, 720 / 2, { // 16:9
	backgroundColor : '#53769A' // if need
});
 pjs.system.initFullPage(); // for Full Page mode


var log    = pjs.system.log;     // log = console.log;
var game   = pjs.game;           // Game Manager
var point  = pjs.vector.point;   // Constructor for Point
var camera = pjs.camera;         // Camera Manager
var brush  = pjs.brush;          // Brush, used for simple drawing
var mouse = pjs.mouseControl.initMouseControl();
var OOP    = pjs.OOP;            // Object's manager
var math   = pjs.math;           // More Math-methods
var levels = pjs.levels;         // Levels manager

 var key   = pjs.keyControl.initKeyControl();


var width  = game.getWH().w; // width of scene viewport
var height = game.getWH().h; // height of scene viewport
//Резолюция экрана
var r = game.getResolution();

pjs.system.setTitle('Burger Game'); // Set Title for Tab or Window





// Фон
    var back = game.newImageObject({
       file : 'images/background.png',
        h : height  ,
        w : width ,    
    });
// задаю переменную счета, что бы менялся персонаж при наборе очков.
 var lastCheckScore  = 0;
//наш счет
 var score = 0;
//рекорд
var record = 60;

var buffer = '';
var messages = [];






//наше меню
game.newLoopFromConstructor('Menu', function(){
    
    var newGame = game.newTextObject({
       text: 'Для начала игры, нажмите START',
        positionC: point(width/2, height/2),
        font: 'Poiret one',
        size: 30,
        color: ' #800000'
        
    });
    
  this.update = function(){
            game.clear;
            back.draw();
            
                brush.drawText({
                      x : width / 2, y : height / 20,
                      text : 'Управление: стрелка влево-вправо ' ,
                      size : 15 * r,
                      color : '#800000',
                      font : 'Poiret one',
                    align : 'center'
                    });
         
         newGame.draw();
        if (key.isDown('ENTER', newGame)){
             game.setLoop('myGame');
         }
      
      
      //Функция для ручного ввода рекордов с клавиатуры
      if (key.isPress('F1'))          // есни нажали F1 то 
      key.setInputMode(true);        // включили режим ввода символов

    if (key.isInputMode()) {        // если включен режим ввода
      var char = key.getInputChar(); // запомним то, что ввели
      var iKey = key.getInputKey();  // запомним клавишу, которой это ввели

      if (iKey) {
        if (iKey == 'BACKSPACE') {
          buffer = buffer.substr(0, buffer.length - 1);
        } else if (iKey == 'ENTER') {
        record = buffer;     // скинули сообщение куда-нибудь
         buffer = '';                  // Очистили буфер
         key.setInputMode(false);      // выключили режим ввода символов
       } else if (iKey == 'F1' || iKey == 'ESC') {
         key.setInputMode(false);
       }
      }
      if (char) {                     // если вводится символ
       if (buffer.length < 30) {      // ограничили в 30 символов
          buffer += char;
        }
      }

    } 
    pjs.brush.drawTextS({
      text : key.isInputMode() ? buffer + '_' : '',
      size : 15,
      color : '#800000',
      x : 10, y : 0
    });     
  }
});

// Game Loop
game.newLoopFromConstructor('myGame', function () {
    
    //переменная скорости
    var speed = 5;
    
    
    //переменные таймера
    var second = 90;
    var i =0;
    var obj;
    
    
    
    //наш работник
var employee = game.newImageObject({
    position : point(600, -100),
       file : 'images/employee.png',
        h : 130 * r, // размер работника
    //отпозицианируем по высоте его
       onload : function() {
           this. y = -this.h + height;
       }
    });
    
    
 var employee1;
    
    
    
    
    //массив бургеров
    var burgers = [];
    //подключение таймера
    var timer = OOP.newTimer(1000, function () { 
  burgers.push(game.newImageObject({
      x : math.random(0, width - 50 * r), //ширина обьекта
      y : -math.random(50*r, 500 * r),
      w : 30 * r, h : 30 *r,
     file : 'images/burger.png'
  }));
 });  

    this.entry = function(){
        // здесь обнуляются все переменные, которые ты меняешь в цикле update
        score = 0;
        speed = 5;
        burgers = [];
         employee = game.newImageObject({
    position : point(600, -100),
       file : 'images/employee.png',
        h : 130 * r, // размер работника
    //отпозицианируем по высоте его
       onload : function() {
           this. y = -this.h + height;
       }
    });
}
     
	this.update = function () {
       
        //дельта-тайм
        var dt = game.getDT(1); 
		game.clear(); // clear screen 
        
        back.draw();
        employee.draw();
       
        
        
             //отрисуем счет
        brush.drawText({
      x : 10, y : 10,
      text : 'Счет: ' + score,
      size : 15 * r,
      color : '#800000',
      font : 'Poiret one'
    });
        brush.drawText({
           x : 10, y : 50,
            text : 'Таймер: ' + second ,
            size : 15 * r,
            color : ' #800000',
            font : 'Poiret one'   
        });
         brush.drawText({
      x : 10, y : 90,
      text : 'Рекорд: ' + record,
      size : 15 * r,
      color : '#800000',
      font : 'Poiret one'
    });
        
         // Таймер добавления бургеров
        // каждую сек новый бургер
        
        timer.restart();
        
        OOP.forArr(burgers, function (el, i) {
                   el.draw(); // Вывод бургеров
                   el.move(point(0, speed )); //двигаем вниз
        
        //проверка на столкновение с сотрудником
            if(el.isIntersect(employee)){
                burgers.splice(i, 1);
                score++;
                speed+= 0.21;
            } 
            
           
           //проверка счета, и смена изображения employee при наборе очков бургеров.
           if (score > lastCheckScore) {
               lastCheckScore = score;
          switch(score){
              case 1:
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
              case 5: 
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg2.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
                  case 10: 
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg3.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
                  case 15: 
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg4.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
                  case 20: 
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg5.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
                   case 25: 
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg6.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
                   case 30: 
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg7.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
                   case 35: 
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg8.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
                   case 40: 
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg9.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
                  case 45: 
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg10.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
                  case 50: 
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg11.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
                   case 55: 
                  employee = game.newImageObject({
                      position: employee.getPosition(0),
                      file : 'images/empl_burg12.png',
                      h : 130 * r, // размер работника
                      //отпозицианируем по высоте его
                      onload : function() {
                      this. y = -this.h + height;
                    }
                        });
                  break;
                  
          
            default:
            break;
          }
           }
          
       });
        
         //движения сотрудника
        if(key.isDown('LEFT')){
            //двигаем влево
            // с ограничением движения за рамки экрана
            
            if(employee.x >= 0){
            employee.setFlip(0, 0);
            employee.x -=  dt ;
            }
        }
        
        if(key.isDown('RIGHT')){
          
            //двигаем вправо
            if(employee.x + employee.w < width){
            employee.setFlip(1, 0);
            employee.x +=  dt;
        } 
        }
        if(key.isDown('ENTER') & key.isDown('LEFT') & key.isPress('RIGHT')){
             score=score + 1;
        }
        
        //Таймер до окончания игры 
         if(i < 60){
         i++;
        }
         if(i==60){
             if(second >0){
                second--;
                i=0;
        }}
        
         if(second==0){
         game.setLoop('GameOver')
         second = 90;      
         }
	};
});

//цикл окончания игры
game.newLoopFromConstructor('GameOver', function(){
    //Объект, Начать заново.
var restart = game.newTextObject({
       text: 'Попробуй еще раз!',
        positionC: point(width/2, height/2),
        font: 'Poiret one',
        size: 30,
        color: ' #800000'
        
    });
    
    
  this.update = function(){
            game.clear;
            back.draw();
      
           
        
                brush.drawText({
                      x : width / 2, y : height / 20,
                      text : 'Ваш счет: ' + score,
                      size : 15 * r,
                      color : '#800000',
                      font : 'Poiret one',
                    align : 'center'
                    });
      
      //функция для отрисовки выйгрыша
      if(record <= score){
          record = score;
          brush.drawText({
                      x : width / 2, y : height / 10,
                      text : 'Поздравляю! Вы победили. Теперь рекорд: ' + score,
                      size : 15 * r,
                      color : '#800000',
                      font : 'Poiret one',
                    align : 'center'
                    });
          
      }else{
          brush.drawText({
                      x : width / 2, y : height / 10,
                      text : 'Вы проиграли, так и не побив рекорд. ',
                      size : 15 * r,
                      color : '#800000',
                      font : 'Poiret one',
                    align : 'center'
                    });
      }
         restart.draw();
        if (key.isDown('ENTER', restart)){
             game.setLoop('myGame');
         }
  }
});
game.startLoop('Menu');
