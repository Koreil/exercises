#Task 3

В этот раз у меня возникла куча трудностей. Причем со всем.)
Сдаю чуточку раньше. Внятных ответов на свои вопросы я пока не нагуглила (хотя пыталась!), попробую еще, но пока так.

##JS

* Как документировать замыкания? И неограниченное количество аргументов? arguments - Array-like, значит, как массив чего-либо? С документаницей в этот раз не задалось, мне очень жаль( Но я послушаю тебя и научусь =)
* Метод reverse из модуля мне не понадобился, и это меня как-то напрягает. Наверное, его нужно было связать с sortBy, но мне показалось, что проще воспользоваться обычным reverse и самой решить, что возвращать.
* Я не знала, в каком виде нужно представить две итоговых коллекции (где or и and), поэтому в моем случае это просто массив с двумя массивами внутри =( В общем-то, я не вполне уверена, что правильно поняла, как должна работать or. Ну и с документированием опять же возникли проблемы. 

##HTML-CSS

* Микроразметку нельзя вставлять в табличные тэги? Валидатор даже не считает, что там ошибка. Он считает, что микроразметки там просто нет...
* Честно говоря, я даже расстроена. Я над всем этим долго думала (дольше, чем над JS!), и то получилось... Так себе. Без прозрачности фона было бы не видно стоблец, который я реализовала через :after, а если строкам задавать z-index ниже, чем у after, он их перекрывает... 
* С поиском по городу отправления тоже как-то не вышло. То есть вышло, но, подозреваю, далеко не то, чего от меня хотели - во-первых, как такового поля "город отправления" в таблице нет =) Поэтому я сделала вывод, что если тип рейса - отправление ("depart"), город по умолчанию будет Москва, а вот тем, из которых летят, мне пришлось задать дополнительные data-атрибуты и сделать цепочку. Потому что убей не знаю, как приравнять атрибут одного элемента к другому или их сравнить в рамках HTML-CSS.
* После выбора "отлет" или "прилет" слетает оформление четных-нечетных строк таблицы. Не придумала, как пофиксить(