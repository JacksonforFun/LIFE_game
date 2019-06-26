var life_list = [];

var field = document.getElementById("field");
var n = field.offsetWidth/40, m = field.offsetHeight/40;


var cells = document.getElementsByClassName("cell");


function delCell(elem, cell_index)
{
	elem.classList.remove('life');
	elem.toggle = !elem.toggle;
	var i = life_list.indexOf(cell_index);
	if (i >= 0) {
	  life_list.splice( i, 1 );
	}
	console.log(life_list);
}

for (var i = 1; i <= (n * m); i++) {
	var newCell = document.createElement('div');
	newCell.className = "cell";
	newCell.toggle = false;
	newCell.timer = 0;
  newCell.addEventListener('click', function(elem){
    var cell_index = Array.prototype.indexOf.call(field.children, (elem ? elem.target : event.srcElement));
    if (!elem.target.classList.contains('life'))
    {
      elem.target.classList.add('life');
      elem.target.toggle = true;
      life_list.push(cell_index);
      console.log(life_list);
    }
    else
    {
      delCell(elem.target, cell_index);
    }


  });
	newCell.onmouseover = function(elem)
	{
		if (!this.toggle)
		{
			return;
		}
    var cell_index = Array.prototype.indexOf.call(field.children, (elem ? elem.target : event.srcElement));
		elem.timer = setTimeout(function(){
    	elem.target.classList.remove('life');
    	elem.target.toggle = !elem.toggle;
    	var i = life_list.indexOf(cell_index);
    	if (i >= 0) {
    	  life_list.splice( i, 1 );
    	}
    	console.log(life_list);
    }, 2000, elem.target);
	}
	newCell.onmouseout = function()
	{
		if (this.timer) {
		clearTimeout(this.timer);
		this.timer = 0;
		}
	};

	field.appendChild(newCell);
}
console.log(field);



function print()
{
	while (field.firstChild) {							// Очищаем "field"
    field.removeChild(field.firstChild);
	}

	for (var i = 0; i < (n * m); i++)  // Заполняем заново пустыми клетками
	{
		var newCell = document.createElement('div');
		newCell.className = "cell";
		newCell.toggle = false;
		newCell.timer = 0;
    newCell.addEventListener('click', function(elem){
      var cell_index = Array.prototype.indexOf.call(field.children, (elem ? elem.target : event.srcElement));
      if (!elem.target.classList.contains('life'))
      {
        elem.target.classList.add('life');
        elem.target.toggle = true;
        life_list.push(cell_index);
        console.log(life_list);
      }
      else
      {
        delCell(elem.target, cell_index);
      }
    });
		newCell.onmouseover = function(elem)
		{
			if (!this.toggle)
			{
				return;
			}
      cell_index = Array.prototype.indexOf.call(field.children, (elem ? elem.target : event.srcElement));
				elem.timer = setTimeout(delCell(elem.target, cell_index), 2000);
		};
		newCell.onmouseout = function()
		{
			if (this.timer) {
			clearTimeout(this.timer);
			this.timer = 0;
			}
		};
		field.appendChild(newCell);
	}

	var cells = document.getElementsByClassName("cell");
	for (var index = 0; index < life_list.length; index++)   // Оживляем клетки по списку life_list
	{
		cells[life_list[index]].classList.add('life');
		cells[life_list[index]].toggle = true;
	}
}






function make_alive_or_not(This_cell, count, new_iteration_list)
{
	if (!cells[This_cell].classList.contains('life') && count == 3)
	{
		var insert = new_iteration_list.indexOf(This_cell);
		if (insert < 0) {
				new_iteration_list.push(This_cell);
		}
	}
	if (cells[This_cell].classList.contains('life') && (count != 2 && count != 3))
	{
		var del = new_iteration_list.indexOf(This_cell);
		if (del >= 0) {
			new_iteration_list.splice( del, 1 );
		}
	}
}

function check_periphery_cell(This_cell, new_iteration_list)
{
	var p_count = 0;
	for (var i = -1; i < 2; i++)
	{
    var tens = This_cell/10>>0;		// Десятки
		for (var j = -1; j < 2; j++)
		{
      var units = This_cell%10;			// Единицы
      var Periphery_cell = (tens+i)*10 + (units+j);
			if ((tens+i) >= 0 && (tens+i) < n && (units+j) >= 0 && (units+j) < m && This_cell != Periphery_cell)		// Если в границах поля и не эта же самая клетка
			{
				if (cells[Periphery_cell].classList.contains('life'))			// Счетчик живых клеток
					p_count++;
			}
		}
	}
	make_alive_or_not(This_cell, p_count, new_iteration_list);		// Оставить в живых или нет
	return;
}

function check_alive_cell(Alive_cell, new_iteration_list)
{
	var a_count = 0;
	for (var i = -1; i < 2; i++)
	{
    var tens = Alive_cell/10>>0;		// Десятки
		for (var j = -1; j < 2; j++)
		{
      var units = Alive_cell%10;			// Единицы
      var Periphery_cell = (tens+i)*10 + (units+j);
			if ((tens+i) >= 0 && (tens+i) < n && (units+j) >= 0 && (units+j) < m && Alive_cell != Periphery_cell)		// Если в границах поля и не эта же самая клетка
			{
				check_periphery_cell(Periphery_cell, new_iteration_list);		// Итерация клетки окружения
				if (cells[Periphery_cell].classList.contains('life'))			// Счетчик живых клеток
					a_count++;
			}
		}
	}
	make_alive_or_not(Alive_cell, a_count, new_iteration_list);		// Оставить в живых или нет
	return;
}

function modeling()
{
  var new_iteration_list = life_list.slice(0);    // Массив результата итерации
	console.log(new_iteration_list);
  for (var i = 0; i < life_list.length; i++)		// Проверяем каждую живую клетку из списка
	{
		check_alive_cell(life_list[i], new_iteration_list);
	}
	life_list = [];
	life_list = new_iteration_list.slice(0);	// Переписываем результат итерации в основной массив живых клеток
}

function start_life ()
{
  setTimeout(function ()
	{
		modeling();
		print();
    if (life_list.length != 0) {
      start_life();
    }
  }, 1000)
}
