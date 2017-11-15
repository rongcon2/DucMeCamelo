var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();
var geocoder = new google.maps.Geocoder();
var intLoc = new google.maps.LatLng(29.5828, -95.5394); // USA 29.5828° N, 95.5394° W Missori 
var myOptions = {zoom: 4, center: intLoc, mapTypeId: google.maps.MapTypeId.HYBRID}; // ROADMAP, HYBRID (sat and st name), TERRAIN
var map;
var panorama, panoramaOptions;
var newLoc, startAddr, endAddr;
var action = "find";
var usermode = "auto";
var markers = [];
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

// NGHE NHAC
//var PList = document.getElementById("PicLink");
var audio = document.getElementById('audio');
var TList = document.getElementById("Title");
var SList = document.getElementById("SongLink");
var albumImage, artist;
var retArray = new Array();
var nameArray = new Array();
var ind = 0; //TList.selectedIndex;
var separator = ";";
var whichAvailBtns = "";
var whichAvailThumbs = "";
var whichAvatar = "";
var type = "";
var mTagDivId = "";
var spinDivId = "";
var subCatDiv = "";
var audioType = "mp3";

// READING
var curPage = 0;
var book = new Array();

// PHOTO SLIDES
var whichSlide = "viet";

// DATABASE
var numMember = 0;
var newMemberIdx = 1000;
var numFields = 6;
var selRowContent = "&id=1&first=1&last=1&title=1&phone=1&email=1&table=";//CAMELO-VIET&mode=";
var tags = ["", "", "&id=", "&first=", "&last=", "&title=", "&phone=", "&email=", "&table=", "&mode="];
var headers = [['Danh Bạ Liên Lạc', 'Tên', 'Họ', 'Tiêu Đề', 'Điện Thoại', 'Email'],
    ['Leaders', 'First Name', 'Last Name', 'Title', 'Phone', 'Email'],
    ['Líderes', 'Nombre de Pila', 'Apellido', 'Título', 'Teléfono', 'Email']];
var dbtable = "CAMELO-MEMBERS";
var headerrow = 0;
var dbmode = "view";

// CALLENDAR 
var month_of_year = [['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'],
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubure', 'noviembre', 'diciembre']];

// OTHERS
var Server = 'http://ducme-camelo.rhcloud.com/index.php';
var menu, title, monthofyear, dayofweek;
var langSelected = "Vietnamese";
var langCal = "vi";
var slideAlbumBeginStr = '<div id="album" style="position: relative; top: 0px; left: 0px; width: 800px;'
        + 'height: 800px; background: #191919; overflow: hidden;">'
        + '<div u="loading" style="position: absolute; top: 0px; left: 0px;">'
        + '<div style="filter: alpha(opacity=100); opacity:1.0; position: absolute; display: block;'
        + ' background-color: #000000; top: 0px; left: 0px;width: 100%;height:100%;">'
        + '</div>'
        + '<div style="position: absolute; display: block; top: 0px; left: 0px;width: 100%; height:100%;">'
        + '</div>'
        + '</div>';
var slideAlbumEndStr = '<span u="arrowleft" class="jssora05l" style="width: 40px; height: 40px; top: 650px; left: 340px;">'
        + '</span>'
        + '<span u="arrowright" class="jssora05r" style="width: 40px; height: 40px; top: 650px; right: 340px">'
        + '  </span>'
        + '  <div u="thumbnavigator" class="jssort01" style="position: absolute; width: 800px; height: 95px; left:0px; bottom: 0px;">'
        + '     <div u="slides" style="cursor: move;">'
        + '        <div u="prototype" class="p" style="position: absolute; width: 100px; height: 100px; top: 0; left: 0;">'
        + '            <div class="w"><div u="thumbnailtemplate" style=" width: 100%; height: 100%; border: none;position:absolute; top: 0; left: 0;"></div></div>'
        + '       <div class="c"></div>'
        + '   </div>'
        + '  </div>'
        + ' </div>'
        + '</div>';

var youTubeEmbedPrefix = "https://www.youtube.com/embed/";
var imgPrefix = "https://ducme-camelo.rhcloud.com/img/";
var imgSlidePrefix = "https://ducme-camelo.rhcloud.com/img/slides/";
var cauLinhHon = [
    {img: ["Cuunuocmy2015.jpg", "Cauchongphathai2015.jpg", "Slide16.jpg"], vid: ["oNUP9Cz9iX8", "9q67amJSTXA"]}
];

var menuSpanish = [
    {html: '<div class="introContent">\
<div><p style="color:black">¡Bienvenidos todos! Por favor iniciar su vista haciendo clic en el botón de menú inferior. Cada rama del menú de nivel inferior incluye un "Home" \
(volver a la página principal) y un botón de "Página Arriba" (subir un nivel) nodo para facilitar la navegación en este sitio web. \
<br><br>Nota: Por favor, abstenerse de utilizar los botones Atrás y Actualizar. Vaya como si usted está usando un teléfono o tablet PC móvil. \
Al hacer clic en el botón Atrás le llevará de vuelta a la página antes de visitar este sitio web. Al hacer clic en el botón Actualizar le llevará \
de vuelta a la página inicial.</p></div><br><ul id="menu">\
                    <div class="mainpageUL"><li><a>Catálogo</a>  \
                        <ul class="sub-menu">\
                           <li><a onclick="processMenu(' + "'thanhgia'" + ');">Cruz y María De Camelo</a></li>'
                + '<li><a onclick="processMenu(' + "'caulinhhon'" + ');">Oraciones Por Las Almas</a></li>'
                + '<li><a onclick="processMenu(' + "'linhhon'" + ');">Alma y Maria Virginal</a></li>'
                + '<li><a onclick="processMenu(' + "'caunguyen'" + ');">Oraciones Diarias</a></li>'
                + '<li><a onclick="processMenu(' + "'lich'" + ');">Calendario Iglesia Y Actividades De Grupo</a></li>'
                + '<li><a onclick="processMenu(' + "'giadinh'" + ');">Familia</a></li>'
                + '</ul>\
                    </li>\
                    <li><a onclick="processMenu(' + "'dockinh'" + ');">Petición De Oración</a>\
                    </li>\
                    <li><a>Contacto</a>\
                        <ul class="sub-menu">\
                            <li><a onclick="processMenu(' + "'danhba'" + ');">Directorio de Contactos</a></li>\
                            <li><a onclick="processMenu(' + "'bando'" + ');">Mapa</a></li>\
                            <li><a onclick="processMenu(' + "'lienhe2'" + ');">Contáctenos</a></li>\
                        </ul>\
                    </li></ul>\
                    <div>\
                    <br><br><br><img class="centering" src="http://ducme-camelo.rhcloud.com/img/DucMeCamelo.gif">\
                    </div>',
        loc: "main", params: ["Menú Principal", "Petición de Oración", "Contacto"], gotoTag: ["mucluc", "xindockinh", "lienhe"]
    },
    {html: '<div>Damos la bienvenida a todas las personas de todos los ámbitos de la vida, independientemente de la religión, la nacionalidad, la orientación o la \
                el valor y la esperanza de encontrar la comodidad y la paz del Creador. Gracias por su visita y le deseamos un día bendito y feliz! \
                <br><br><u><b>VIDEO OF CROSS AND MARY MT CARMELO\'S SIGN</b></u><br><br>\
                <iframe width = "760px" height = "550px" src = "https://www.youtube.com/embed/0Aepu5u2X2w" frameborder = "0" allowfullscreen> </iframe> \
                <br><br>Querido público preciosa,<br><br>\
                Nos ha presenciado múltiples signo de la Cruz y una sombra alma apareció en nuestra casa. A través de la oración ferviente y la inspiración \
                divina, nos damos cuenta de esta es la gracia de Dios María y que sólo Dios. Fue un milagro divino Sólo Dios mismo puede realizar. \
                <br><br>Después de varios días de oración a Dios y María Mt Carmel como guía, decidimos compartir el esta información a usted. \
                Antes era más que dispuestos a compartir para que todos sean conscientes de las buenas noticias de Dios\'s y me he informado. Después de que dar a la gente la oportunidad de pensar \\n\
                y buscó ayuda para usted, su familia o seres queridos a vivir cerca de Dios y Madre que antes y más fuerza para llevar camisa de señora y el \
                recitado el rosario todos los días. \
                <br><br>"Hit el enemigo Satanás: Por último, vamos a tomar fuerza de Dios con su inmenso poder O llevaba la armadura de Dios a \
                nos solidez para hacer frente a todos los trucos de la intriga diablo y cabal ". (Carta a los Efesios 6, 10-11) \
                <br><br>Siendo así, la gente va a glorificar a Dios y María en su vida ahora mismo, aunque hay muchas dificultades y se encuentran en el momento final de \
                la humanidad tendrá muchos desafíos del diablo, desastres y crisis para el mundo. Ojalá tú y tus público familiar es más favorable \
                santos tus y María. \
                <br><br>Imprimir este respecto, \
                <br><br>Family Quang, Nguyen Thanh Tuyen\
                <br><br><img src="http://ducme-camelo.rhcloud.com/img/StPaultool.jpg" width="760px" height="550px"></div>',
        loc: "thanhgia", params: ["Poema Para María", "María Carmel Starlight", "Historia", "Fiesta de María Carmel", "Home"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div><u>MẸ NÚI THÁNH CAMELO DỊU NGỌT</u>\
<br>(Thơ sáng tác do Maria Lê Bích Tuyền, Aug, 14, 2015)\
<br><br>LAY MẸ NÚI THÁNH CAMELO DỊU NGỌT,\
<br><br>NHƯ ÁNH SAO TOẢ SÁNG TRÊN TRỜI.\
<br><br>DÌU CON KHỎI CHỐN TỐI TĂM,\
<br><br>HỒNG ÂN CỦA MẸ BAO LA VÔ VÀN.\
<br><br>ÔI, BAO LA TÌNH THƯƠNG CỦA MẸ,\
<br><br>AN ỦI CON NHƯNG LÚC ƯU PHIỀN. \
<br><br>MẸ LAU DÒNG LỆ TRÊN MI.\
<br><br>CHO CON SỨC MẠNH BƯỚC ĐI VỮNG VÀNG.\
<br><br>TRAO CHO CON NIỀM TIN, HI VỌNG......\
<br><br>MẸ THƯƠNG BAN ÁO THÁNH CỦA NGƯỜI :\
<br><br>THƯƠNG YÊU CHE CHỞ ĐỜI CON,\
<br><br>GIÚP CON THOÁT KHỎI HIỂM NGUY TRONG ĐỜI.\
<br><br>MẸ THƯƠNG CỨU GIÚP VÀ NÂNG ĐỠ,\
<br><br>BAN BÌNH AN Ở PHÚT LÂM CHUNG.\
<br><br>VÒNG TAY CỦA MẸ ẤM ÊM.\
<br><br>CON XIN CÃM TẠ MUÔN ĐỜI.\
<br><br>AMEN.</div>',
        loc: "tgdiungot", params: ["Poema Para María", "María Carmel Starlight", "Historia", "Fiesta de María Carmel", "Home"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div><u> Starlight Carmelite Mother</u> (song composed by Michael Quang Nguyen, Aug 8, 2015) \
<br><br>1. Mom, our life which is full of ups and downs arduous, full of enemies lurking dangers on every side and always harmed \
we. Please Me injured arms and legs sheltered the group started Mother crushed snakes Three Remuneration (*) Satan, \
<br><br>(chorus): Ask Mom\'s Starlight Ca maze illuminates the path of life to heaven \
<br><br>2- human life many mourn in solitude tree looks just know, your mother households and helped me move ahead in line for deliverance from Insurance \
risk. May she wipe off your tears and asked Mother walked date murky sea life (back chorus) \
<br><br>3- Qui here a devoted heart and mind the rest of his life, she just looked upon and received injuries to her child is always carrying \
cover. In the arms of love I will give shelter shall not fear the evil enemies around you (back chorus) \
<br><br>(*) three family feud = array (homosexuality), stateless, without religion \
<br><br>Music piano piano accompaniment for the song Mother sings Starlight Mountain Carmel</div>',
        loc: "tganhsao", params: ["Poema Para María", "María Carmel Starlight", "Historia", "Fiesta de María Carmel", "Home"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div>Bienvenido a oír las bendiciones del Evangelio Mary Mount Ca laberinto y la salvación de la madre. Te invitamos a acceder a \
aprender y desea que usted y su familia están siempre muchas gracias de María siempre, y ser un gran consuelo en los últimos momentos \
fin de la vida. Sinceramente en ella. Grupo Señora Čermeľ parcela \
<br><br><u>Historia</u> - Extracto de Wikipedia \
<br> carmelita considerado como la montaña sagrada. La tradición dice que este es el lugar donde el profeta Elías tomó esta montaña para defender su creencia en ataque \
persecución, así como la capacitación del alma fiel con Dios. Entonces el ermitaño se hace en las carmelitas consagrados a María y \
la vida contemplativa. En el siglo XII, el Patriarca de Jerusalén Patriarca Albert ha reunido todos en una corriente, expedido para un \
regla por el Papa Honorio III aprobó en 1226 [1]. También ese año, el Papa permitió celebrar una misa solemne en la línea de Notre Dame carmelita. \
<br><br>Debido a dificultades en la fase con la tierra santa musulmana ocupada, los Carmelitas se habían mudado a Cambridge, Inglaterra. San Simón Stock es \
Abad pidió a María para salvar [2]. Ministerio de hábito religioso se dice que se deriven del caso María se apareció 16 de julio en \
Con San Simón Stock en 1251 y le dijo: "Toma esta línea de ropa para dar a la madre y para los sacerdotes como una señal del favor de ella y cuidar de \
para el niño. Este es un signo de la salvación. La liberación de peligro. ¿Quién mató a que trajo la paz a esta manifestación, será de fuego eterno y salvaré \
despedirlos del purgatorio el sábado después de su muerte. "\
<br><br>1674, fiesta de María Carmen se extendió a los países con rey católico. 1679, al reino de Austria, Portugal. Países bajo \
Celebre este Papa desde que el Papa Benedicto XIII 1725 celebración popular en toda la Iglesia edictos emitidos el 24 de septiembre de 1726. \
15 de mayo 1892, el Papa León XIII privilegiada "Porciúncula" (Gracias amnistía para cualquiera que visite la iglesia) en esta fiesta [3]. Esta ceremonia es celebrar \
en toda la Iglesia Católica el 16 de julio de cada año. \
<br><br><img src="http://ducme-camelo.rhcloud.com/img/Slide1.jpg" width="250" height="250"> \
<img src="http://ducme-camelo.rhcloud.com/img/Slide2.jpg" width="250" height="250">\
<img src="http://ducme-camelo.rhcloud.com/img/Slide3.jpg" width="250" height="250">\
</div>',
        loc: "tglichsu", params: ["Poema Para María", "María Carmel Starlight", "Historia", "Fiesta de María Carmel", "Home"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<u>Fiesta de María Carmelita</u> - Desde el Pueblo de Dios \
Vietnamita <br> Linh Tien Khai \
<br><br>Entre recordar fiesta mariana, fiesta de Nuestra Señora de Lourdes, además, allí está la Iglesia Virgen de vacaciones Carmel. El convento de las Carmelitas título unido a una línea son \
establecido en el Monte Carmelo en la región de Galilea, Palestina. En él se describe una de las formas más populares de la devoción a María en \
Historia de la Iglesia. En la reforma calendario litúrgico del Concilio Vaticano II después de esta fiesta se celebra el 16 de julio, y el monumento no es obligatorio. \
Montañas <br> Carmel es un largo de más de 25 kilómetros, que se extiende desde la bahía de Haifa, en el Mar Mediterráneo hasta las llanuras Esdrelon. Mejor lugar 546 \
cansado. Monte Carmelo o la Biblia menciona por su exuberante vegetación; y di a Carmel se refiere a la belleza y la riqueza de la fértil. Ya está \
plazo en Isaías capítulo 35 alegría alentadora natural para Dios es el Salvador de la próxima: "Anímate ningún contrato, O pastos del desierto seco y fuego, \
Por favor, ser páramos feliz florecer, ser jubiloso como flor del lirio de la piña, y bailar gritando con alegría. Desierto fue otorgado esplendor de la montaña \
Líbano, el brillo del Monte Carmelo y de Sarón llanura. La gente va a ver el esplendor del Señor y el brillo de nuestro Dios "(Is 35,1-2). \
<br><br>En el capítulo 7 canciones de marido que estaba tomando fotos Carmel para describir su belleza como de la esposa: "Sobre mi cuerpo, mis picos de cabeza \
Carmel, mi pelo una cinta rosada, olas flotantes, grilletes Monarch "(Dc 7.6). \
<br> Hablando de Dios día y castigar a Israel Amos escribió al comienzo del capítulo 1: "... el duelo pastor prado teñido, montaña Carmel \
se ha desvanecido "(Am 1,2). \
<br><br>Monte Carmelo tradición asociada con el profeta Elías, aunque el Antiguo Testamento menciona solo un profeta. Hoy en día los árabes \
Monte Carmelo todavía se llama "Gebel Mar Elyas" "Monte Santa Elia". Capítulo 18 del Rey me dijo que en el siglo IX aC, el rey Akhap escuchar \
Reina Dedabel con el reino de Israel bajo el Norte abandone Señor Dios y Baal adoración a dioses extranjeros. En los profetas de \
Dios acaba de dejar solos Elia. Pero el coraje profético se atreve a desafiar a los 450 falsos profetas de Dedabel reina en un holocausto en el monte \
Carmel para probar a Israel para ver quién es el verdadero Dios. \
<br><br>Como parte de los falsos profetas de Dedabel superan reina, Elia dejó su sitio a ellos para ofrecer el sacrificio antes. Bailaron y rajar sus espadas desde la mañana \
hasta el medio día sin ver a los dioses respondieron. Gire profeta Elías, puso la madera, vaca sacrificada a la parte superior, a continuación, enviaron tres veces regar profusamente mojar tanto ranurado \
alrededor del altar, entonces la oración profética y fuego del cielo para quemar la ceremonia de sacrificio, la madera, la piedra y el polvo, y secar el agua en las zanjas. Gobierno de la gente \
para el suelo y anunciar al Señor Dios. Profeta envió a 450 personas detenidas y matar a los falsos profetas en KISON muelle (1 V 18,20-40). Desde entonces Carmel es \
asociado con el profeta Elías, y también conocida como la "montaña del profeta Elías." \
<br><br>A finales del siglo XII con un poco ermitaño tenido que vivir en el monte Carmelo. Son fieles a la moral occidental peregrinaje a Tierra Santa, seguramente \
es seguir el último ejército cruzado de ese tiempo a Palestina para proteger los lugares santos del cristianismo. Ellos fueron Alemania Alberto Avogadro, Shanghai \
Accesorios Jerusalén entre los años 1206-1214, se reunieron en grupos, y escribir para ellos una regla de vida. Durante su gobierno se afirma que "se configuran \
cerca de la fuente del profeta Elías, en el valle de Es-Siah ", donde la ruta" La zona de Jerusalén ", es una guía de peregrinación compilado \
Entre los años 1220-1229, sólo muestra "el Carmelo monjes" vivir al lado de una "capilla de Notre Dame". Las personas no conocen esta iglesia se construyó cuando, \
pero parece que era "muy hermosa pequeña iglesia" era guía "Los caminos y el peregrinaje a Tierra Santa" de que hablar. Si bien no sabemos \
¿Qué pasa con otras iglesias como "un trabajo muy elegante," el Papa Urbano IV se hace referencia en la letra "Quoniam - Al ver que" de 19 de mayo \
Dos años 1263. \
<br><br>Sin duda hay tiempo ese grupo de "hermanos religiosos" han emigrado al oeste e incluso llamada "La Santa María Carmel" en el título \
Ciertamente sido un hábito. Y este título apareció por primera vez en un documento del Papa Inocencio IV de 13 de enero 1252. \
Y que la devoción\'s absolutamente correcto en el siglo XIII la venta de esta línea ha sido establecida dedicada a la Virgen María, y los monjes profesos a la Madre \
Dios. Esta consagración se expresa en una plataforma a través de la elección de María como "hegemónico" de "donde" la primera en el Monte Carmelo. Según noción \
Eventos medievales legales dirigidas a los monjes de la línea eran totalmente sirve propietarios Ella, con una especial devoción. Promete \
María se expresa en la vida de las familias con muchos signos religiosos, incluidos los signos de la liturgia y la devoción con carácter comunitario y personalidad \
anillo.\
<br><br>Podemos decir que la Santísima Virgen María del Monte Carmelo se experimenta, adoración y contemplación de los hermanos religiosos y todos los que más tarde \
compartirán la vida de la posición, como las religiosas, las fraternidades seglares y tres líneas de Notre Dame carmelita. Señora del Carmen es fundamental para la experiencia \
el espíritu del grupo fue fundado con el propósito de la Tierra Santa vivir vidas perfectas en el espíritu del Evangelio, en la soledad de la contemplación, concentración donde la palabra \
orar constantemente, la escucha de la Palabra de Dios, en un ambiente de sencillez, la pobreza y el trabajo laboral, siguiendo el ejemplo de la vida de María\'s en \
Nazaret. \
<br><br>La referencia Monte Carmelo asociado con el nombre de María, más que carácter geográfico histórico, para indicar que la línea fue nacido y tiene ma \
Los padres que viven. Así, en su título orígenes "Santa María del Monte Carmelo" no implica una imagen en particular o un nuevo aspecto de la \
rendir culto. Esto es plausible, ya que en la devoción manifestación concreta se expresa en los títulos de las diversas iglesias, los Carmelitas \
destacando varios aspectos de la vida de María como: la maternidad de Dios, la Virgen, la Inmaculada Concepción, la variable \
comunicaciones fijas. Así que en la antigua tradición "Santa María del Monte Carmelo" es simplemente María como se ve en el contexto del Evangelio, el Señor \
Virgen María está en blanco, que recibió la palabra de Dios, y el "sí" de las personas se ha convertido en la Madre del Hijo encarnado de Dios hecho hombre. \
<br> Huelga énfasis demasiado, podemos decir que el "padre carmelita del convento" mirada de María de Nazaret, "la esclava del Señor", como el que sugirió \
inspiración y guía, como todos los de su vida, donde mantener centrado, palabra contemplativa. Por lo tanto la experiencia Carmelitas de María como medio \
Ella es una madre en el camino espiritual, en un ambiente proporcionó dirección íntima relación con sígame y vivir una vida plena y psicotrópica "en el \
siervos de Cristo ", en un ambiente de sencillez y austeridad. Eso es lo que se describe en la" regla de la vida ", que desde el siglo XIV la Orden\'s autor \
rápidamente vio encarnada en María. \
<br><br>En la leyenda surgió más tarde, varias historias estaban presentes incluso en la primera línea de autógrafos también fue entregada a \
nosotros. Muestran que la lectura de la visión mariana "del Monte Carmelo pequeña nube" por el profeta Elías, y propuso a sus discípulos. \
Capítulo 18 habla del Rey invito Rey Akhap profeta Elías para comer porque oyó las duchas. Mientras comía el rey, el profeta Elías a \
Carmel cima de la montaña, se inclinó hasta el suelo se desplomó de rodillas. Entonces él le dijo al niño a subir y mirar en la misma casa de campo en el lado del mar. Se sube y no decir nada en absoluto. \
El sábado pasado, dijo: "He aquí una pequeña nube en la mano que es desde el mar en aumento. Profeta Elías dijo:" Usted va a decir al rey frenos Akhap que \
no sea atrapado por la lluvia. "Inmediatamente el cielo negro nublando viento atascado flotante y luego una lluvia torrencial rey, montando Jezreel Akhap Yahvé puso las manos sobre Elia;.. Él cinturones \
y en funcionamiento antes de que el rey Akhap hasta al Jezreel "(1 V 18,41-46). \
<br><br>pequeña nube del Monte Carmelo, que es el signo de un fin a los tres años de sequía, los Carmelitas como imágenes describen María, trajo \
la lluvia en el mundo después de la sequía. La lluvia fue la gracia de Dios terminación momento difícil árida para Israel. La lluvia es la gracia que Jesús \
Cristo, el Mesías, Agua y Pan de Vida de Dios a la humanidad. \
<br><br>Luego está la historia de María visitó en varias ocasiones la comunidad de Carmelitas con los padres, San Joaquín y Santa Ana. Entonces devociones \
María de los monjes había sido considerado desde siempre, o por lo menos desde el tiempo de los apóstoles. Aparte del tipo moral corpus especial de tiempo que da lugar \
nacido de arte, de una manera positiva esta relatos sagrados describen conceptos en el espíritu de la buena noticia de usar para María, \
¿Quién recibió Carmelitas en "mi casa", y la asistencia cometido bajo los monjes viven único Salvador, Jesucristo su Hijo. \
<br><br>(Mariology article 343) Linh Tien Khai <br> </ div>',
        loc: "rgleducme", params: ["Poema Para María", "María Carmel Starlight", "Historia", "Fiesta de María Carmel", "Home"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div><p style="color:black">Nos quedamos para el Nombre de Dios y de las almas María Carmelita Compasivos se cree que colocar constante a Dios cara \
Por favor, Dios dibujar extremadamente brillante. Amén.</p> \
<br>La creencia en la resurrección de Jesús cristiana e inmenso amor de María Carmen trama, nos \
gustaría conmemorar el día y rezar por las almas de los abuelos, los padres, los juegos de azar, los viajes para la apertura, el tío Thim, hermanos y hermanas, el pueblo \
familiares, parientes, maestros, benefactores, amigos, amigos y almas huérfanos están descansando en el agua temprano y disfrutar el cielo santo rostro de Dios y de María. \
<br><br>deseos de paz en Dios y en María siempre.</div>',
        loc: "caulinhhon", params: ["Videos", "Home"], gotoTag: ["clhvideo", "main"]},
    {html: '<div><p style="color:black"><br>Te invitamos ver algunos vídeos de Youtube en cuanto el cielo, el purgatorio, el infierno y el destino del alma.</p></div>',
        loc: "clhvideo", params: ["Heaven And Hell", "Purgatorio", "Página Arriba", "Home"], gotoTag: ["thiennguc", "luyennguc", "caulinhhon", "main"]},
    {html: '<div><p style="color:black"><br>Te invitamos ver algunos vídeos de Youtube en cuanto el cielo, el purgatorio, el infierno y el destino del alma.</p></div>',
        loc: "thiennguc", params: ["Heaven And Hell", "Purgatorio", "Página Arriba", "Home"], gotoTag: ["thiennguc", "luyennguc", "caulinhhon", "main"]},
    {html: '<div><p style="color:black"><br>Te invitamos ver algunos vídeos de Youtube en cuanto el cielo, el purgatorio, el infierno y el destino del alma.</p></div>',
        loc: "luyennguc", params: ["Heaven And Hell", "Purgatorio", "Página Arriba", "Home"], gotoTag: ["thiennguc", "luyennguc", "caulinhhon", "main"]},
    {html: '',
        loc: "linhhon", params: ["La reverencia de mártir", "Home"], gotoTag: ["tudao", "main"]},
    {html: '<div>2004/03/30 VIETNAM (http://www.asianews.it)\
                <br><br><u>Vietnamita Padre Mártires venerada por los cristianos y no cristianos mismos </u> \
<br><br>Bac Lieu (AsiaNews / UCAN) - Los peregrinos han acudido a honrar la tumba de un sacerdote martirizado fue asesinado con \
sus feligreses, el 12 de marzo de 1946. El aniversario de Padre\'s de la muerte de Xavier Truong Buu Diep Francois trajeron más de 30.000 católicos, \
Protestantes y no cristianos a Tac Say parroquia en la provincia de Bac Lieu, 1.990 kilómetros al sur de Hanoi, para proporcionar el respeto y la gratitud \
Gracias a la antigua hombre santo muchos dicen que es el responsable de la curación de dolencias físicas, aumentar la prosperidad y suerte. \
El párroco el padre Jean Baptiste ahora Tran Duc Hung encabezó una misa celebran al aire libre con otros sacerdotes 18, marcando el día \
Martirio vieiras hace 60 años. \
<br><br>Padre Diep nació en 1897 y fue ordenado sacerdote en 1924, después de completar estudios en Phnom Penh Seminario Mayor \
Camboya. Durante su tiempo como sacerdote en Vietnam, el país fue devastado con conflictos entre facciones religiosas y el \
tratamiento, y fue informado por un superiores eclesiásticos a abandonar el área más segura para todos. \"Yo vivo en medio de mis ovejas y yo \
morir. No voy a ir a ninguna parte\", dijo el sacerdote. Entonces él y 30 laicos capturados por las fuerzas enemigas y mantenidos en un repositorio \
arroz. El sacerdote cuerpo\'s fue encontrado más tarde en un estanque cercano, aunque las autoridades no están de acuerdo que lo mató y por qué. \
<br><br>Ahora peregrinos hacen cola para tocar la tumba y su estatua y dar regalos de incienso, velas, el dinero, la comida y la oración. \
En la celebración, los fieles trajo cochinillo, carne de cerdo, pan, flores y frutas en su lugar en la mesa delante del templo. Motel \
local estaba lleno a la capacidad, la carga de tres veces el precio normal para los invitados listos. Un viejo peregrino 60 años de Ho \
Chi Ming dijo que 50 miembros de su grupo tuvieron la suerte de encontrar un lugar para dormir en las escaleras de la casa parroquial. \"Padre Diep me curó pronto \
cuando visité su tumba, \"dijo, refiriéndose a la artritis severa que antes le había impedido caminar correctamente. Desde entonces, viene todos los años \
para darle las gracias, con lo amigos que también buscan el apoyo y el material espiritual. Miles de peregrinos han dejado expresiones de gratitud \
por las oraciones fueron contestadas con la pequeña tablilla de piedra grabado con las palabras: \"Grateful Padre Diep\" para ser colocado en el reloj de pared \
alrededor de la iglesia. Muchos de Vietnam en el extranjero y también para rezar por los sacerdotes final. Padre Hung dijo que la iglesia se ha convertido en un lugar \
famosa peregrinación en la región desde 1980, después de los informes de la comunicación contestado oraciones lu entre las personas. Fue oficialmente \
reconocido como un lugar de peregrinación de la diócesis en 1996. \
<br><br>24 de febrero de Emmanuel Le Phong Thuan Obispos celebrado misa Tho, con motivo del inicio de la construcción de una iglesia \
Hecho de 2.000 asientos para sustituir la estructura actual fue construida en 1963. La comunidad Tac Say Católica, fue fundada en 1925 con \
200 católicos, ahora tiene 1.500 católicos.</div>',
        loc: "tudao", params: ["Página Arriba", "Home"], gotoTag: ["linhhon", "main"]},
    {html: '<div><u>Beijing Weekdays </u> \
Vietnamese (Sunday to Saturday) \
<br><br><u>Beijing bright </u> \
<br>Beijing Spirit \
<br>Vietnamese Lauds God Revelation of St. Brigitta \
<br>Vietnamese Divine Mercy St. Faustina \
<br>Vietnamese Economics Holy Rosary Chain & Business Lady Ca maze - Pray for the souls \
<br><br><u>3pm Vespers at Christ Dead </u> \
<br><br>Beijing Spirit \
<br>Vietnamese Kinh mercy \
<br>Vietnamese Kinh 14 Stations of the Cross \
<br>Vietnamese Kinh Revelation God \
<br>Vietnamese Kinh Jesus Maria Joseph the love for souls. Business Lady Ca mesmerizing plot \
<br><br><u>Vespers</u> \
<br><br>Beijing Spirit \
<br>Vietnamese Kinh Revelation God \
<br>Vietnamese Kinh mercy \
<br>Vietnamese Kinh Lady Ca maze - Rosary - Litany for the soul - May God pity the Third Person visited. \
<br>Vietnamese Soi dulling my heart full of darkness. \
<br>Vietnamese household help hold the position should pray. \
<br>Vietnamese Open mouth proclaim the eternal Holy Name. \
<br><br>Oh Holy Spirit, help us to remember and appreciate Christ\'s salvation of His Death on the cross and resurrection that God \
loves us, forgives our sins and give us a chance to have life in heaven with his life if we love \
everyone around us. Teach and give us courage so that we can love, forgive and accept everyone \
because they are our brothers and sisters in Christ, especially the poor, the unfortunate, the sick, the rejected, unwanted, being \
contempt ... Our enemies, our hate .... because we are children of God. \
<br><br><u>Small Fellowship Groups</u> \
<br><br>2nd & 4th Friday nights of month,7pm @\
<br>TBD \
<br>Topical Discussions & fellowship\
<br>Contact for details</div>',
        loc: "caunguyen", params: ["Video", "Home"], gotoTag: ["cnvideo", "main"]},
    {html: '<div><div><p style="color:black"><br>HECHO EN DIOS - vídeo muestra cómo un león expresa su amor...</p> \
<br><iframe width="760px" height="550px" src="https://www.youtube.com/embed/NLB_u695wTg" frameborder="0" allowfullscreen></iframe></div>',
        loc: "cnvideo", params: ["Página Arriba", "Home"], gotoTag: ["caunguyen", "main"]},
    {html: '<div class="fullcaldiv"><select id="monthBox" class="monthbox" onChange="changeMonthYearData();"></select><div id="calendar"></div></div>',
        // {html: '<div><iframe src="https://www.google.com/calendar/embed?src=en.usa%23holiday@group.v.calendar.google.com&amp;mode=MONTH&amp;showTitle=0&amp;showNav=1&amp;showDate=1&amp;showTabs=1&amp;showCalendars=0&amp;hl=es" title="US Holidays" width="100%" height="600" frameborder="0" scrolling="no"></iframe></div>',
        loc: "lich", params: ["Home"], gotoTag: ["main"]},
    {html: '<div><img src="http://ducme-camelo.rhcloud.com/img/Thanh.jpg" width="250" height="250">\
<br><br>Cecilia Thanh Nguyen, Associate in Science Degree - according sell 2-year Bachelors and cosmetology experts. Favorite reference and reading. \
<br><br><img src = "http://ducme-camelo.rhcloud.com/img/Tuyen.jpg" width = "250" height = "250"> \
<br><br>Maria Le Bich Tuyen, Bachelor of Science, Bachelor\'s and professor of aesthetics, favorite health and nutrition. Former students at Thien Phuoc,\
Tan Dinh, Saigon (1970-1975) \
<br><br><img src = "http://ducme-camelo.rhcloud.com/img/Quang.jpg" width = "250" height = "250"> \
<br><br>Michael Nguyen Xuan Quang, Cao MS degrees in \
chemical engineering and enterprise governance. Interests on nutrition, exercise and group activities. Alumni Lasan Duc Minh Tan \
Dinh, Saigon - (1959-1966), TNU, Christian Brothers University, Vanderbilt, UH</div>',
        loc: "giadinh", params: ["Home"], gotoTag: ["main"]},
    {html: '<div id="maincontent"></div>',
        loc: "danhba", params: ["Home"], gotoTag: ["main"]},
    {html: '<br>Damos la bienvenida y las gracias a todos sus comentarios, sugerencias y/o preguntas para hacer de este sitio web \
mejor en el interés de la \ la difusión de la buena nueva a todos. Muchas gracias y deseándole con gracia en la vida.\
<br><br>Nombre:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comname" type="text" size="30" value=""> (Necesario)\
<br><br>Email:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comemail" type="text" size="50" value=""> (Necesario)\
<br><br>Teléfono:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comphone" type="text" size="10" value="">\
<br><br>Subjeto:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comsubject" type="text" size="100" value=""> (Necesario)\
<br><br><div>Messae: (Necesario)<br><textarea style="color:black; background-color:lightgray;" id="comcontent" spellcheck="true" rows="20" cols="98"></textarea>\
<br><br><input class="centerbutton" type="button" onclick="Email([\'comname\', \'comemail\', \'comsubject\', \'comcontent\'],\'comphone\')" value="Enviar A Nosotros"></input> </div>\
<div id="emailMsg"></div>\
<img class="centerIcon" src="http://ducme-camelo.rhcloud.com/img/commentbox.gif">',
        loc: "lienhe2", params: ["Home"], gotoTag: ["main"]},
    {html: 'Dios espera pacientemente para escuchar sus peticiones de oración en todo momento, en todas las circunstancias, participar con usted. \
<br><br>Vamos a unirse a su oración en la recepción de sus solicitudes. <br> favor, sabemos que somos hijos preciosos todo lo que Dios\'s, \
y Dios siempre está con nosotros. \
<br><br>Muchas bendiciones a usted, \
<br><br>Group Prayer Our Requirements.\
<br><br>Nombre:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="prayname" type="text" size="30" value=""> (Necesario)\
<br><br>Email:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="prayemail" type="text" size="50" value=""> (Necesario)\
<br><br>Teléfono:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="prayphone" type="text" size="10" value="">\
<br><br>Subjeto:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="praysubject" type="text" size="100" value=""> (Necesario)\
<br><br><div>Messae: (Necesario)<br><textarea style="color:black; background-color:lightgray;" id="praycontent" spellcheck="true" rows=20" cols="98"></textarea>\
<br><input class="centerbutton" type="button" onclick="Email([\'prayname\', \'prayemail\', \'praysubject\', \'praycontent\'],\'prayphone\')" value="Enviar Petición"></input> </div>\
<div id="emailMsg"></div> \
<br><img class="centerIcon" src="http://ducme-camelo.rhcloud.com/img/prayer-requests.png">',
        loc: "dockinh", params: ["Home"], gotoTag: ["main"]},
    {html: '<div class="mapContent"><div><span style="color:black;">En primer lugar, elegir una de las dos opciones de encontrar o llegar Dirección. Luego, elegir Google o Auto opción Completa si desea \ \n\
Google sentir su escritura y proporcionar una lista de posibles ubicaciones u opciones manuales si se puede la dirección exacta de entrada en la que desea aprovechar.</span><br><br>'
                + '<form style="float:left">'
                + '<input id="find" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="1" ><span style="color:black;">Find</span>'
                + '<input id="direction" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="2"><span style="color:black;">Get Direction</span>'
                + '</form>'
                + '<span style="color:black;float:left;">&nbsp;&nbsp;<u>USING</u>&nbsp;&nbsp;</span>'
                + '<form style="float:left">'
                + '<input id="autofind" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="3"><span style="color:black;">Google Auto Complete</span>'
                + '<input id="manualfind" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="4"><span style="color:black;">Manual Input</span>'
                + '</form>'
                + '<br /><br />'
                + '<div style="clear:both" id="mapinput">'
                + '<span style="color:black;">Location:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapfind" type="text" value="">&nbsp;'
                + '</div>'
                + '<br>'
                + '<span style="color:black;">Arrastre la figura amarilla al lugar deseo de vistas panorámicas calle.</span>'
                + '<div id="mappanel">'
                + '<div id="map-canvas" style="width:800px; height:500px;"></div>'
                + '</div>'
                + '<div id = "pano" style = "clear:both;width:800px; height:500px;"></div></div></div>',
        loc: "bando", params: ["Home"], gotoTag: ["main"]}
];

var menuEnglish = [
    {html: '<div class="introContent">\
<div><p style="color:black">Welcome everyone! Please start your view by clicking on the menu button below. Each branch of the lower level menu include a "Home" \
(back to Main Page) and a button "Page Above" (go up one level) node to facilitate navigation in this website.\
<br><br>Note: Please refrain from using the Back and Refresh buttons. Navigate as if you are using a mobile phone or computer tablet. \
Clicking the Back button will take you back to the page before you visit this website. Clicking the Refresh button will take you back to the Home Page.</p></div><br><ul id="menu"> \
                    <div class="mainpageUL"><li><a>Category</a>  \
                        <ul class="sub-menu">\
                           <li><a onclick="processMenu(' + "'thanhgia'" + ');">Cross and Mary Mt Carmel</a></li>'
                + '<li><a onclick="processMenu(' + "'caulinhhon'" + ');">Prayers For The Souls</a></li>'
                + '<li><a onclick="processMenu(' + "'linhhon'" + ');">Soul & Virgin Mary</a></li>'
                + '<li><a onclick="processMenu(' + "'caunguyen'" + ');">Daily Prayers</a></li>'
                + '<li><a onclick="processMenu(' + "'lich'" + ');">Church Calendar & Group Activity</a></li>'
                + '<li><a onclick="processMenu(' + "'giadinh'" + ');">Family Circle</a></li>'
                + '</ul>\
                    </li>\
                    <li><a onclick="processMenu(' + "'dockinh'" + ');">Prayer Request</a>\
                    </li>\
                    <li><a>Contact</a>\
                        <ul class="sub-menu">\
                            <li><a onclick="processMenu(' + "'danhba'" + ');">Contact Directory</a></li>\
                            <li><a onclick="processMenu(' + "'bando'" + ');">Map</a></li>\
                            <li><a onclick="processMenu(' + "'lienhe2'" + ');">Contact Us</a></li>\
                        </ul>\
                    </li></ul>\
                    <div>\
                    <br><br><br><img class="centering" src="http://ducme-camelo.rhcloud.com/img/DucMeCamelo.gif">\
                    </div>',
        loc: "main", params: ["Home", "Prayer Request", "Contact"], gotoTag: ["mucluc", "xindockinh", "lienhe"]
    },
    {html: '<div>We welcome all people from all walks of life regardless of religion, nationality, orientation, or the \
                value and hope you find comfort and peace from the Creator. Thank you for visiting and wish you a blessed and happy day! \
                <br><br>We would like to share the experience of feeling the grace of Jesus and the Virgin Mary at Mount Carmel, \
                hoping to build something good spiritual life for the family and those around us. We wish you would  \
                receive the same experience as us and perform the same action for others around you. Peace be with you in God and Mary always. \
                <br><br><u><b>VIDEO OF CROSS AND MARY MT CARMELO\'S SIGN</b></u><br><br>\
                <iframe width = "760px" height = "550px" src = "https://www.youtube.com/embed/0Aepu5u2X2w" frameborder = "0" allowfullscreen> </iframe> \
                <br><br>Dear precious audience,<br><br>\
                Multiple Sign of the Cross and a soul shadow appeared at our house. Through fervent prayer and divine inspiration, we realize \
                Here the signs of this is the grace of God Mary and that only God do the same. It was a divine miracle that nobody \
                can do so. \
                <br><br>Families us, after several days of prayer and ask God and Mary Ca maze makes all your video is presented to viewers. \
                Prior was only willing to share for everyone to be aware of God\'s good news and I have informed. After that give people a chance to think \
                and sought help for yourself, family or loved ones to live close to God and Mother than before and more strength to carry Shirt Lady and the \
                recited the rosary every day. \
                <br><br>"Hit the enemy Satan: Finally, let us take strength from God with his immense power. Or bore the armor of God to \
                we robustness to cope with all the tricks of the devil intrigue and cabal ". (Letter to the Ephesians 6, 10-11) \
                <br><br>Being so, people will glorify God and Mary in your life right now, though there are many difficulties and are in the end time of \
                humanity will have many challenges of the devil, disaster and crisis for the world. Wish you and your family audiences are more favor \
                thy saints and Mary. \
                <br><br>Print this regards,\
                <br><br>Family Quang, Nguyen Thanh Tuyen\
                <br><br><img src="http://ducme-camelo.rhcloud.com/img/StPaultool.jpg" width="760px" height="550px"></div>',
        loc: "thanhgia", params: ["Poem For Mary Carmel", "Mary Carmel Starlight", "History", "Feast Of Mary Carmel", "Home"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div><u>MẸ NÚI THÁNH CAMELO DỊU NGỌT</u>\
<br>(Thơ sáng tác do Maria Lê Bích Tuyền, Aug, 14, 2015)\
<br><br>LAY MẸ NÚI THÁNH CAMELO DỊU NGỌT,\
<br><br>NHƯ ÁNH SAO TOẢ SÁNG TRÊN TRỜI.\
<br><br>DÌU CON KHỎI CHỐN TỐI TĂM,\
<br><br>HỒNG ÂN CỦA MẸ BAO LA VÔ VÀN.\
<br><br>ÔI, BAO LA TÌNH THƯƠNG CỦA MẸ,\
<br><br>AN ỦI CON NHƯNG LÚC ƯU PHIỀN. \
<br><br>MẸ LAU DÒNG LỆ TRÊN MI.\
<br><br>CHO CON SỨC MẠNH BƯỚC ĐI VỮNG VÀNG.\
<br><br>TRAO CHO CON NIỀM TIN, HI VỌNG......\
<br><br>MẸ THƯƠNG BAN ÁO THÁNH CỦA NGƯỜI :\
<br><br>THƯƠNG YÊU CHE CHỞ ĐỜI CON,\
<br><br>GIÚP CON THOÁT KHỎI HIỂM NGUY TRONG ĐỜI.\
<br><br>MẸ THƯƠNG CỨU GIÚP VÀ NÂNG ĐỠ,\
<br><br>BAN BÌNH AN Ở PHÚT LÂM CHUNG.\
<br><br>VÒNG TAY CỦA MẸ ẤM ÊM.\
<br><br>CON XIN CÃM TẠ MUÔN ĐỜI.\
<br><br>AMEN.</div>',
        loc: "tgdiungot", params: ["Poem For Mary Carmel", "Mary Carmel Starlight", "History", "Feast Of Mary Carmel", "Home"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div><u> Starlight Carmelite Mother</u> (song composed by Michael Quang Nguyen, Aug 8, 2015) \
<br><br>1. Mom, our life which is full of ups and downs arduous, full of enemies lurking dangers on every side and always harmed \
we. Please Me injured arms and legs sheltered the group started Mother crushed snakes Three Remuneration (*) Satan, \
<br><br>(chorus): Ask Mom\'s Starlight Ca maze illuminates the path of life to heaven \
<br><br>2- human life many mourn in solitude tree looks just know, your mother households and helped me move ahead in line for deliverance from Insurance \
risk. May she wipe off your tears and asked Mother walked date murky sea life (back chorus) \
<br><br>3- Qui here a devoted heart and mind the rest of his life, she just looked upon and received injuries to her child is always carrying \
cover. In the arms of love I will give shelter shall not fear the evil enemies around you (back chorus) \
<br><br>(*) three family feud = array (homosexuality), stateless, without religion \
<br><br>Music piano piano accompaniment for the song Mother sings Starlight Mountain Carmel</div>',
        loc: "tganhsao", params: ["Poem For Mary Carmel", "Mary Carmel Starlight", "History", "Feast Of Mary Carmel", "Home"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div>Welcome to hear the gospel blessings Mary Mount Ca maze and Salvation of the mother. Invite you to access \
learn and wish you and your family are always many graces of Mary always, and be much consolation in the last moments \
end of life. Sincerely in her. Group Lady Cermel plot \
<br><br><u>History </u> - Excerpt from Wikipedia \
<br><br>Carmelite regarded as holy mountain. Tradition says this is where the prophet Elijah took up this mountain to defend his belief in attack \
persecution, as well as training the faithful soul with God. Then the hermit is made in the Carmelites consecrated to Mary and \
the contemplative life. In the twelfth century, the Patriarch of Jerusalem Patriarch Albert has gathered all into a stream, issued for an \
rule by Pope Honorius III approved in 1226 [1]. Also that year, the Pope allowed to celebrate a solemn Mass in Notre Dame Carmelite line. \
<br> Because of difficulties in phase with the Muslim holy land occupied, the Carmelites had moved to Cambridge, England. St. Simon Stock is \
Abbot begged Mary to save [2]. Ministry of religious habit is said to be derived from the event Mary appeared July 16 in \
With St. Simon Stock in 1251 and said: "Take this line of clothing to give the mother and for priests as a sign of favor from her and care for \
for the child. This is a sign of salvation. Deliverance from danger. Who killed that brought peace to this manifestation, will from eternal fire and I will save \
fire them from purgatory on Saturday after they died. "\
<br><br>1674, feast of Mary Mount Carmel spread to countries with Catholic king. 1679, to the kingdom of Austria, Portugal. Countries under \
Celebrate this pope since Pope Benedict XIII 1725 popular celebration in the whole Church edicts issued by September 24 1726. \
May 15, 1892, Pope Leo XIII privileged "Portiuncula" (Thanks amnesty for anyone visiting the church) in this holiday [3]. This ceremony is to celebrate \
in the whole Catholic Church on July 16 every year. \
<br><br><img src="http://ducme-camelo.rhcloud.com/img/Slide1.jpg" width="250" height="250"> \
<img src="http://ducme-camelo.rhcloud.com/img/Slide2.jpg" width="250" height="250">\
<img src="http://ducme-camelo.rhcloud.com/img/Slide3.jpg" width="250" height="250">\
</div>',
        loc: "tglichsu", params: ["Poem For Mary Carmel", "Mary Carmel Starlight", "History", "Feast Of Mary Carmel", "Home"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<u> Feast of Mary Carmelite </u> - From the People of God \
Vietnamese<br>Linh Tien Khai \
<br><br>Among remember Marian feast, feast of Our Lady of Lourdes in addition, there is the Church Lady of Carmel holidays. The title Carmelite convent attached to a line are \
established on Mount Carmel in the Galilee region Palestina. It describes one of the most popular forms of devotion to Mary in \
Church history. In the liturgical calendar reform of Vatican Council II after this feast is celebrated on July 16, and the memorial is not mandatory. \
<br><br>Carmel Mountains is a more than 25 kilometers long, stretching from the Bay of Haifa on the Mediterranean Sea to the plains Esdrelon. Highest place 546 \
tired. Mount Carmel or the Bible mentions for its lush vegetation; and say to Carmel refers to the beauty and richness of fertile. There \
term in Isaiah chapter 35 natural encouraging cheer for God is the Saviour of the forthcoming: "Cheer up any contracts, O dry desert grasses and fire, \
Please wasteland happily flourish, be jubilant as pineapple lily bloom, and dance joyfully shouting. Desert was bestowed splendor of mountain \
Lebanon, the brightness of Mount Carmel and Sharon plain. People will see the splendor of the Lord and the brightness of our God "(Is 35.1-2). \
<br><br>In chapter 7 Songs of husband he was taking pictures Carmel to describe her beauty as Spouse: "On my body, my head peaks \
Carmel, my hair a ribbon pink, floating waves, shackles monarch "(Dc 7.6). \
<br><br>Speaking of God day and chastise Israel Amos wrote at the start of chapter 1: "... the pastor meadow dyed mourning, mountain Carmel \
has faded "(Am 1,2). \
<br><br>Mount Carmel tradition associated with the prophet Elijah, although the Old Testament mentions only a single prophet. Today the Arabs \
Mount Carmel is still called "Gebel Mar Elyas" "Mount St. Elia". Chapter 18 of the King I said that in the ninth century BC, King Akhap hear \
Dedabel queen with the kingdom of Israel under the North abandon Lord God and Baal worship foreign gods. In the prophets of \
God just left alone Elia. But prophetic courage dare challenge the 450 false prophets of Dedabel queen in a burnt sacrifice on Mount \
Carmel to prove to Israel to see who is the true God. \
<br><br>As part of the false prophets of Dedabel outnumber queen, Elia made way for them to offer sacrifice before. They danced and slitting their swords from morning \
until noon without seeing the gods answered. Turn prophet Elijah, he put wood, cow sacrificed to the top, then sent three times watering profusely wet both grooved \
around the altar, then the prophetic prayer and fire from heaven to burn the sacrifice ceremony, wood, stone and dust, and dry the water in ditches. Government people \
for the ground and proclaim the Lord God. Prophet sent 450 people arrested and kill false prophets in spring KISON (1 V 18.20 to 40). Since then Carmel is \
associated with the prophet Elijah, and also known as the "mountain of the prophet Elijah." \
<br><br>In the late twelfth century with some hermit had to live on Mount Carmel. They are faithful to Western morality Holy Land pilgrimage, surely \
is to follow the last crusading army of that time to Palestina to protect the holy places of Christianity. They were Germany Alberto Avogadro, Shanghai \
Accessories Jerusalem between the years 1206-1214, gathered together into groups, and write for them a rule of life. During his rule states that "they are set \
up near the source of the prophet Elijah, in the valley Es-Siah ", where the route" The area of Jerusalem ", is a pilgrimage guidebook compiled \
Between the years 1220-1229, only shows "the monks Carmel" living next to a "chapel of Notre Dame". People do not know this church was built when, \
but it seems that it was "very beautiful small church" was guidebook "The roads and the Holy Land pilgrimage" to talk about. While we do not know \
What about other churches as "very elegant work," Pope Urban IV referred to in the letter "Quoniam - Seeing that" dated 19 May \
Two year 1263. \
<br><br>There is certainly time that group of "religious brothers" have emigrated to western and even called "The Holy Mary Carmel" in the title \
certainly been a habit. And this title first appeared in a document of Pope Innocent IV dated 13 January 1252. \
And that\'s absolutely correct in the thirteenth century the sale of this line has been established dedicated to the Virgin Mary, and the monks professed devotion to Mother \
God. This consecration is expressed in a platform through choice of Mary as "hegemonic" of "where" the first on Mount Carmel. According notion \
Legal medieval events led to the monks of the line were totally serves She owners, with a special devotion. Vows to \
Mary is expressed in the lives of families with many religious signs, including the signs of the liturgy, and devotion with community character and personality \
ring.\
<br><br>We can say that the Blessed Virgin Mary of Mount Carmel is experienced, worship and contemplation by the religious brothers and all who later \
will share the life of the position, such as women religious, the lay fraternities and three Notre Dame Carmelite line. Lady of Carmel is central to the experience \
the spirit of the group was founded with the purpose of the Holy Land live perfect lives in the spirit of the Gospel, in the solitude of contemplation, concentration where the word \
pray constantly, listening to the Word of God, in an atmosphere of simplicity, poverty and labor work, following the example of Mary\'s life in \
Nazareth. \
<br><br>The Mount Carmel reference associated with the name of Mary, merely historical geographical character, to indicate where the line was born and has tu \
Parents living. Thus in its origins title "Holy Mary of Mount Carmel" does not imply a particular image or a new aspect of the \
worship. This is plausible, because in the concrete manifestation devotion is expressed in the titles of the various churches, the Carmelites \
highlighting various aspects of life of Mary as: the motherhood of God, the virgin, the conception immaculate, variable \
fixed communications. So in the early tradition "Holy Mary of Mount Carmel" is just plain Mary as seen in the context of the Gospel, the Lord \
Virgin Mary is in white, who received the word of God, and the "yes" of people has become the Mother of the incarnate Son of God made man. \
<br><br>Needless emphasis too, we can say that the "parent Carmelite convent" look of Mary of Nazareth, "the handmaid of the Lord", as the one who suggested \
inspiration and guidance, as all of their lives, where keeping focused, contemplative word. Therefore the experience Carmelites of Mary as medium \
She is both a mother on the spiritual path, in an intimate atmosphere provided direction regarding follow me and to live full lives and psychotropic "in the \
servants of Christ ", in an atmosphere of simplicity and austerity. That is what is described in the "rule of life", which since the fourteenth century the Order\'s author \
quickly saw incarnated in Mary. \
<br><br>In the legend arose later, several stories were present even in the first autograph line was also handed down to \
we. They show that the reading of Marian vision "of Mount Carmel small cloud" by the prophet Elijah, and proposed to his disciples. \
Chapter 18 tells of the King I invite King Akhap prophet Elijah to eat because he heard the showers. While eating the king, the prophet Elijah to \
Carmel mountain top, bowed to the ground slumped on his knees. Then he told the boy to go up and look at the same cottage on the sea side. It goes up and say nothing at all. \
Last Saturday it said, "Behold, a small cloud in the hand who is from the rising sea. Prophet Elijah said, "You go to say to the king Akhap brakes that \
lest stuck down rain. " Immediately black sky clouding floating wind jammed and then pouring rain. King, riding Izreel Akhap. Yahweh put hands on Elia; he belts \
and running before the king Akhap until at Izreel "(1 V 18.41 to 46). \
<br><br>small cloud of Mount Carmel that is the sign of an end to the three-year drought, the Carmelites as pictures describe Mary, brought \
rain to the world after the drought. Rain was the grace of God termination arid difficult time for Israel. Rain is grace that Jesus \
Christ, the Messiah, Water and Bread of Life from God to mankind. \
<br><br>Then there is the story of Mary repeatedly visited the community of Carmelites with parents, St. Joachim and St. Anna. Then devotions \
Mary of the monks had been considered from time immemorial, or at least from the time of the apostles. Apart from the moral kind special corpus of time that gives rise \
born of art, in a positive way this sacred stories describe concepts in the spirit of friendly good news for Mary, \
Who received Carmelites in "my house", and assistance committed under the monks live only Savior, Jesus Christ her Son. \
<br><br>(Mariology article 343) Linh Tien Khai <br> </ div>',
        loc: "rgleducme", params: ["Poem For Mary Carmel", "Mary Carmel Starlight", "History", "Feast Of Mary Carmel", "Home"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div><p style="color:black">We stay for the Name of God and of Mary Carmelite Compassionate souls are thought to place constant seen God face \
Please God draw extremely bright. Amen.</p><br>Belief in the Resurrection of Jesus Christian and immense Love of Mary Mount Carmel plot, we would \
like to commemorate the day and pray for the souls of Grandparents, Parents, gambling, traveling for opening, Uncle Thim, Brothers and Sisters, the people \
of kin, relatives, teachers, benefactors, friends, friends and orphaned souls are resting on the water early and enjoy heaven holy face of God and Mary. \
<br><br>Wish peace in God and Mary always.</div>',
        loc: "caulinhhon", params: ["Videos", "Home"], gotoTag: ["clhvideo", "main"]},
    {html: '<div><p style="color:black"><br>We invite you see some Youtube videos regarding heaven, purgatory, hell and the fate of the soul.</p></div>',
        loc: "clhvideo", params: ["Heaven And Hell", "Purgatorio", "Página Arriba", "Home"], gotoTag: ["thiennguc", "luyennguc", "caulinhhon", "main"]},
    {html: '<div><p style="color:black"><br>We invite you see some Youtube videos regarding heaven, purgatory, hell and the fate of the soul.</p></div>',
        loc: "thiennguc", params: ["Heaven And Hell", "Purgatorio", "Página Arriba", "Home"], gotoTag: ["thiennguc", "luyennguc", "caulinhhon", "main"]},
    {html: '<div><p style="color:black"><br>We invite you see some Youtube videos regarding heaven, purgatory, hell and the fate of the soul.</p></div>',
        loc: "luyennguc", params: ["Heaven And Hell", "Purgatorio", "Página Arriba", "Home"], gotoTag: ["thiennguc", "luyennguc", "caulinhhon", "main"]},
    {html: '',
        loc: "linhhon", params: ["Reverence Of Martyr", "Home"], gotoTag: ["tudao", "main"]},
    {html: '<div>2004/03/30 VIETNAM (http://www.asianews.it)\
                <br><br><u>Vietnamese Martyrs Father venerated by Christians and non-Christians Same </u> \
<br><br>Bac Lieu (AsiaNews / UCAN) - The pilgrims have flocked to honor the grave of a martyred priest was killed with \
his parishioners on March 12, 1946. The anniversary of Father\'s death Xavier Truong Buu Diep Francois brought more than 30,000 Catholics, \
Protestants and non-Christians to Tac Say parish in Bac Lieu province, 1,990 kilometers south of Hanoi, to provide the respect and gratitude \
Thanks to the ancient holy man many say is responsible for the healing of physical ailments, increase prosperity and luck. \
The parish priest Father Jean Baptiste now Tran Duc Hung led a Mass celebrating outdoors with other priests 18, marking the day \
Scallops martyrdom 60 years ago. \
<br><br>Father Diep was born in 1897 and was ordained a priest in 1924, after completing studies at Phnom Penh Major Seminary in \
Cambodia. During his time as a priest in Vietnam, the country was ravaged with conflicts between religious factions and the \
treatment, and he was informed by an ecclesiastical superiors to leave the area safer for everyone. \ "I live among my flock and I will \
die. I will not go anywhere \ "the priest said. Then he and 30 lay people captured by enemy forces and held in a repository \
rice. The priest\'s body was later found in a nearby pond, though authorities do not agree who killed him, and why. \
<br><br>Now pilgrims line up to touch the tomb and his statue and give gifts of incense, candles, money, food and prayer. \
In celebration, the faithful brought suckling pig, pork, bread, flowers and fruits in place on the table in front of the temple. Motel \
local was filled to the capacity, charging three times the regular price for the guests ready. A 60 year old pilgrim from Ho \
Chi Ming said 50 maincontent of her group were lucky to find a place to sleep on the steps of the rectory. \ "Father Diep cured me soon \
when I visited his grave, \ "she said, referring to the severe arthritis that had previously prevented her from walking properly. Since then, she comes every year \
to thank him, bringing friends who also seek support and spiritual material. Thousands of pilgrims have left expressions of gratitude \
for the prayers were answered with the small stone tablet engraved with the words, \ "Grateful Father Diep \" to be placed on the wall clock \
around the church. Many of Vietnam in foreign countries and also to pray for priests end. Father Hung said that the church has become a place \
famous pilgrimage in the region since 1980, after reports of answered prayers lu communication among people. It was officially \
recognized as a place of pilgrimage of the diocese in 1996. \
<br><br>February 24, Emmanuel Le Phong Thuan Bishops celebrated Mass Tho, to mark the beginning of the construction of a church \
Made of 2,000 seats to replace the current structure was built in 1963. The Tac Say Catholic community, was founded in 1925 with \
200 Catholics, now has 1,500 Catholics.</div>',
        loc: "tudao", params: ["Page Above", "Home"], gotoTag: ["linhhon", "main"]},
    {html: '<div><u>Beijing Weekdays </u> \
Vietnamese (Sunday to Saturday) \
<br><br><u>Beijing bright </u> \
<br>Beijing Spirit \
<br>Vietnamese Lauds God Revelation of St. Brigitta \
<br>Vietnamese Divine Mercy St. Faustina \
<br>Vietnamese Economics Holy Rosary Chain & Business Lady Ca maze - Pray for the souls \
<br><br><u>3pm Vespers at Christ Dead </u> \
<br><br>Beijing Spirit \
<br>Vietnamese Kinh mercy \
<br>Vietnamese Kinh 14 Stations of the Cross \
<br>Vietnamese Kinh Revelation God \
<br>Vietnamese Kinh Jesus Maria Joseph the love for souls. Business Lady Ca mesmerizing plot \
<br><br><u>Vespers</u> \
<br><br>Beijing Spirit \
<br>Vietnamese Kinh Revelation God \
<br>Vietnamese Kinh mercy \
<br>Vietnamese Kinh Lady Ca maze - Rosary - Litany for the soul - May God pity the Third Person visited. \
<br>Vietnamese Soi dulling my heart full of darkness. \
<br>Vietnamese household help hold the position should pray. \
<br>Vietnamese Open mouth proclaim the eternal Holy Name. \
<br><br>Oh Holy Spirit, help us to remember and appreciate Christ\'s salvation of His Death on the cross and resurrection that God \
loves us, forgives our sins and give us a chance to have life in heaven with his life if we love \
everyone around us. Teach and give us courage so that we can love, forgive and accept everyone \
because they are our brothers and sisters in Christ, especially the poor, the unfortunate, the sick, the rejected, unwanted, being \
contempt ... Our enemies, our hate .... because we are children of God. \
<br><br><u>Small Fellowship Groups</u> \
<br><br>2nd & 4th Friday nights of month,7pm @\
<br>TBD \
<br>Topical Discussions & fellowship\
<br>Contact for details</div>',
        loc: "caunguyen", params: ["Video", "Home"], gotoTag: ["cnvideo", "main"]},
    {html: '<div><div><p style="color:black"><br>MADE IN GOD - Video below shows how a lion expresses its love...</p> \
<br><iframe width="760px" height="550px" src="https://www.youtube.com/embed/NLB_u695wTg" frameborder="0" allowfullscreen></iframe></div>',
        loc: "cnvideo", params: ["Page Above", "Home"], gotoTag: ["caunguyen", "main"]},
    {html: '<div class="fullcaldiv"><select id="monthBox" class="monthbox" onChange="changeMonthYearData();"></select><div id="calendar"></div></div>',
        //{html: '<div><iframe src="https://www.google.com/calendar/embed?src=en.usa%23holiday@group.v.calendar.google.com&amp;mode=MONTH&amp;showTitle=0&amp;showNav=1&amp;showDate=1&amp;showTabs=1&amp;showCalendars=0&amp;hl=en" title="US Holidays" width="100%" height="600" frameborder="0" scrolling="no"></iframe></div>',
        loc: "lich", params: ["Home"], gotoTag: ["main"]},
    {html: '<div><img src="http://ducme-camelo.rhcloud.com/img/Thanh.jpg" width="250" height="250">\
<br><br>Cecilia Thanh Nguyen, Associate in Science Degree - according sell 2-year Bachelors and cosmetology experts. Favorite reference and reading. \
<br><br><img src = "http://ducme-camelo.rhcloud.com/img/Tuyen.jpg" width = "250" height = "250"> \
<br><br>Maria Le Bich Tuyen, Bachelor of Science, Bachelor\'s and professor of aesthetics, favorite health and nutrition. Former students at Thien Phuoc,\
Tan Dinh, Saigon (1970-1975) \
<br><br><img src = "http://ducme-camelo.rhcloud.com/img/Quang.jpg" width = "250" height = "250"> \
<br><br>Michael Nguyen Xuan Quang, Cao MS degrees in \
chemical engineering and enterprise governance. Interests on nutrition, exercise and group activities. Alumni Lasan Duc Minh Tan \
Dinh, Saigon - (1959-1966), TNU, Christian Brothers University, Vanderbilt, UH</div>',
        loc: "giadinh", params: ["Home"], gotoTag: ["main"]},
    {html: '<div id="maincontent"></div>',
        loc: "danhba", params: ["Home"], gotoTag: ["main"]},
    {html: '<br>We welcome and thank all your comments, suggestions, and/or questions to make this web site better in the the interest of \
spreading the good news to all. Thank you and wishing you with grace in life.\
<br><br>Name:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comname" type="text" size="30" value=""> (Required)\
<br><br>Email:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comemail" type="text" size="50" value=""> (Required)\
<br><br>Phone:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comphone" type="text" size="10" value="">\
<br><br>Subject:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comsubject" type="text" size="100" value=""> (Required)\
<br><br><div>Message: (Necesario)<br><textarea style="color:black; background-color:lightgray;" id="comcontent" spellcheck="true" rows="20" cols="98"></textarea>\
<br><br><input class="centerbutton" type="button" onclick="Email([\'comname\', \'comemail\', \'comsubject\', \'comcontent\'],\'comphone\')" value="Send To Us"></input> </div>\
<div id="emailMsg"></div>\
<img class="centerIcon" src="http://ducme-camelo.rhcloud.com/img/commentbox.gif">',
        loc: "lienhe2", params: ["Home"], gotoTag: ["main"]},
    {html: 'God waits patiently to hear your prayer requests \
at all times, in all circumstances, engage with you. <br><br>We will join you in prayer in receiving your requests. \
<br><br>Please know that we are all God\'s precious children, and God is always with us. \
<br><br>Many blessings to you, \
<br><br>Group Prayer Our Requirements.\
<br><br>Name:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="prayname" type="text" size="30" value=""> (Required)\
<br><br>Email:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="prayemail" type="text" size="50" value=""> (Required)\
<br><br>Phone:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="prayphone" type="text" size="10" value="">\
<br><br>Subject:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="praysubject" type="text" size="100" value=""> (Required)\
<br><br><div>Message: (Required)<br><textarea style="color:black; background-color:lightgray;" id="praycontent" spellcheck="true" rows=20" cols="98"></textarea>\
<br><input class="centerbutton" type="button" onclick="Email([\'prayname\', \'prayemail\', \'praysubject\', \'praycontent\'],\'prayphone\')" value="Send Request"></input> </div>\
<div id="emailMsg"></div> \
<br><img class="centerIcon" src="http://ducme-camelo.rhcloud.com/img/prayer-requests.png">',
        loc: "dockinh", params: ["Home"], gotoTag: ["main"]},
    {html: '<div class="mapContent"><div><span style="color:black;">First, choose one of two options Find or Get Direction. Then, either choose Google or Auto Complete option if you want to \
Google to feel your typing and provide a list of possible locations or manual options if you can input the exact address where you want to tap into.</span><br><br>'
                + '<form style="float:left">'
                + '<input id="find" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="1" ><span style="color:black;">Find</span>'
                + '<input id="direction" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="2"><span style="color:black;">Get Direction</span>'
                + '</form>'
                + '<span style="color:black;float:left;">&nbsp;&nbsp;<u>USING</u>&nbsp;&nbsp;</span>'
                + '<form style="float:left">'
                + '<input id="autofind" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="3"><span style="color:black;">Google Auto Complete</span>'
                + '<input id="manualfind" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="4"><span style="color:black;">Manual Input</span>'
                + '</form>'
                + '<br /><br />'
                + '<div style="clear:both" id="mapinput">'
                + '<span style="color:black;">Location:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapfind" type="text" value="">&nbsp;'
                + '</div>'
                + '<br>'
                + '<span style="color:black;">Drag the yellow figure to the desire spot for panoramic street view.</span>'
                + '<div id="mappanel">'
                + '<div id="map-canvas" style="width:800px; height:500px;"></div>'
                + '</div>'
                + '<div id = "pano" style = "clear:both;width:800px; height:500px;"></div></div></div>',
        loc: "bando", params: ["Home"], gotoTag: ["main"]}
];

var menuViet = [
    {html: '<div class="introContent">\
<div><p style="color:black">Chào mừng tất cả mọi người! Bạn hãy bắt đầu xem bằng cách chọn các nút menu bên dưới. Mỗi chi nhánh menu cấp thấp hơn bao gồm một "Trang Chính" \
(trở lại trang này) và một nút "Trang Trên" (đi lên một cấp độ) nút để tạo điều kiện chuyển hướng trong trang website này.\
<br><br>Chú ý: Xin vui lòng không sử dụng nút Back và nút Refresh. Xin điều hướng y như bạn đang sử dụng điện thoại di động hoặc máy \
tính bảng. Nhấn vào nút Back sẽ đưa bạn trở lại trang trước khi bạn truy cập trang web này. Nhấn nút Refresh sẽ đưa bạn trở về trang chủ.</p></div><br>\
                    <div class="vietmainpageUL">\n\
                    <ul id="menu">\
                    <li><a>Mục Lục</a>  \
                        <ul class="sub-menu">\
                           <li><a onclick="processMenu(' + "'thanhgia'" + ');">Thánh Giá và Đức Mẹ Ca mê lô</a></li>\
                           <li><a onclick="processMenu(' + "'caulinhhon'" + ');">Cầu Nguyện Cho Các Linh Hồn</a></li>\
                           <li><a onclick="processMenu(' + "'linhhon'" + ');">Hình Ảnh Linh Hồn Bay Về Đức Mẹ Camêlô</a></li>\
                           <li><a onclick="processMenu(' + "'caunguyen'" + ');">Cầu Nguyện Trong Ngày</a></li>\
                           <li><a onclick="processMenu(' + "'lich'" + ');">Lịch Hội Thánh & Sinh Hoạt Nhóm</a></li>\
                           <li><a onclick="processMenu(' + "'giadinh'" + ');">Gia Đình</a></li>\
                        </ul>\
                    </li>\
                    <li><a onclick="processMenu(' + "'dockinh'" + ');">Yêu Cầu Cầu Nguyện</a></li>\
                    <li><a onclick="processMenu(' + "'nhac'" + ');">Nghe Nhạc / Radio</a></li>\
                    <li><a>Liên Hệ</a>\
                        <ul class="sub-menu">\
                           <li><a onclick="processMenu(' + "'danhba'" + ');">Danh Bạ Liên Lạc</a></li>\
                           <li><a onclick="processMenu(' + "'bando'" + ');">Bản Đồ</a></li>\
                           <li><a onclick="processMenu(' + "'lienhe2'" + ');">Liên Hệ</a></li>\
                        </ul>\
                    </li>\
                    </ul>\
                    </div>\
                    <div><br><br><br><img class="vietcentering" src="http://ducme-camelo.rhcloud.com/img/DucMeCamelo.gif"></div>',
        loc: "main", params: ["Mục Lục", "Xin Đọc Kinh", "Liên Hệ"], gotoTag: ["mucluc", "xindockinh", "lienhe"]
    },
    {html: '<div>Chúng tôi chào đón tất cả mọi người từ tất cả mọi nẻo đường của cuộc sống không phân biệt tôn giáo, quốc tịch, định hướng, hay chính \
                trị và hy vọng bạn tìm thấy sự thoải mái và bằng an từ Đấng Tao Hoa. Xin Cảm ơn bạn đă ghé thăm và chúc bạn có một ngày may mắn và vui vẻ!\
                <br><br>Chúng tôi xin chia sẻ kinh nghiệm về những cảm nhận các ơn thánh của Chúa Giê su, Đức Mẹ Đồng Trinh Maria Núi Ca mê lô và các thánh của \
                Chúa. Hi vọng sẽ xây dựng một vài điều tốt cho đời sống linh thiêng cho gia đình và những người chung quanh. Ước mong bạn cũng sẽ chung \
                một chí hướng để chia sẽ ơn Chúa và Đức Mẹ cho mọi người khác. Kính chúc an bình trong Chúa và Mẹ Maria luôn mãi.\
                <br><br><u><b>VIDEO THÁNH GIÁ VÀ ĐỨC MẸ CAMELO CHO DẤU CHỈ</b></u><br><br>\
                <iframe width="760px" height="550px" src="https://www.youtube.com/embed/0Aepu5u2X2w" frameborder="0" allowfullscreen></iframe>\
                <br><br>Kính chào quí khán giả,<br><br>\
                Nhiều dấu Thánh Giá và một bóng linh hồn đã xuất hiện tại nhà của chúng tôi. Qua lời kinh tha thiết và được ơn Chúa soi sáng, chúng tôi nhận ra \
                đây những dấu lạ này là hồng ân của Đức Mẹ và của Chúa mà chỉ có Chúa mới làm ra được như vậy. Quả là một phép lạ siêu phàm mà không ai có \
                thể làm được như thế.<br><br>\
                Gia Đình chúng tôi, sau nhiều ngày cầu nguyện và xin Chúa và Đức Mẹ Ca mê lô giúp cho bài video được trình bày cho quí khán giả xem. \
                Trước là chỉ có thiện ý để chia sẻ cho mọi người được biết tin vui của Chúa và Mẹ đã thông báo cho. Sau là cho mọi người có dịp suy nghĩ \
                và tìm cách giúp cho chính mình, gia đình hay người thân được sống gần Chúa và Mẹ hơn trước và thêm sức mạnh khi mang áo Đức Mẹ và việc \
                đọc kinh mân côi hằng ngày.<br><br>\
                “Đánh giặc quỉ Satan: Cuối cùng, chúng ta hãy lấy sức mạnh từ Thiên Chúa với quyền năng bao la của Ngài. Hay mang lấy áo giáp của Chúa để\
                chúng ta vững mạnh để đương đầu với mọi thủ đoạn mưu mô của ma quỉ và bè lũ”.  (Thư gửi tin hữu thành ÊPhêSô  6, 10-11)<br><br>\
                Được vậy, mọi người sẽ làm vinh danh Chúa và Đức Mẹ trong cuộc sống hiện tại tuy có nhiều khó khăn và đang ở trong thời gian cuối của\
                nhân loại sẽ có nhiều thử thách của ma quỉ, tai ương và khủng hoảng cho thế giới. Kính chúc quí khán giả và gia đình được nhiều ơn \
                thánh của Chúa và Đức Mẹ. Nay in kính chào,<br><br> Gia Đình Quang, Tuyền & Mỹ Thanh Nguyễn\
                <br><br><img src="http://ducme-camelo.rhcloud.com/img/StPaultool.jpg" width="760px" height="550px"></div>',
        loc: "thanhgia", params: ["Thơ Mẹ Dịu Ngọt", "Mẹ Ánh Sao Camêlô", "Lịch Sử", "Lễ Đức Mẹ Camêlô", "Trang Chính"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div><u>MẸ NÚI THÁNH CAMELO DỊU NGỌT</u>\
<br>(Thơ sáng tác do Maria Lê Bích Tuyền, Aug, 14, 2015)\
<br><br>LAY MẸ NÚI THÁNH CAMELO DỊU NGỌT,\
<br><br>NHƯ ÁNH SAO TOẢ SÁNG TRÊN TRỜI.\
<br><br>DÌU CON KHỎI CHỐN TỐI TĂM,\
<br><br>HỒNG ÂN CỦA MẸ BAO LA VÔ VÀN.\
<br><br>ÔI, BAO LA TÌNH THƯƠNG CỦA MẸ,\
<br><br>AN ỦI CON NHƯNG LÚC ƯU PHIỀN. \
<br><br>MẸ LAU DÒNG LỆ TRÊN MI.\
<br><br>CHO CON SỨC MẠNH BƯỚC ĐI VỮNG VÀNG.\
<br><br>TRAO CHO CON NIỀM TIN, HI VỌNG......\
<br><br>MẸ THƯƠNG BAN ÁO THÁNH CỦA NGƯỜI :\
<br><br>THƯƠNG YÊU CHE CHỞ ĐỜI CON,\
<br><br>GIÚP CON THOÁT KHỎI HIỂM NGUY TRONG ĐỜI.\
<br><br>MẸ THƯƠNG CỨU GIÚP VÀ NÂNG ĐỠ,\
<br><br>BAN BÌNH AN Ở PHÚT LÂM CHUNG.\
<br><br>VÒNG TAY CỦA MẸ ẤM ÊM.\
<br><br>CON XIN CÃM TẠ MUÔN ĐỜI.\
<br><br>AMEN.</div>',
        loc: "tgdiungot", params: ["Thơ Mẹ Dịu Ngọt", "Mẹ Ánh Sao Camêlô", "Lịch Sử", "Lễ Đức Mẹ Camêlô", "Trang Chính"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div><u>Mẹ Ánh Sao Camêlô</u> \
<br>(Bài hát sáng tác do Micae Quang Nguyễn, Aug 8, 2015)\
<br><br>1- Mẹ ơi, cuộc đời chúng con bao gian nan đầy những thăng trầm, đầy hiểm nguy quân thù rình rập tứ phía và luôn hãm hại \
chúng con. Xin Me thương dang tay che chở  đoàn con và chân Mẹ đạp nát đầu rắn Ba Thù(*) Satan,\
<br><br>(điệp khúc): Cầu xin Mẹ là Ánh Sao Ca mê lô soi sáng cho chúng con đường sống tới thiên đàng\
<br><br>2- Đời con còn nhiều khóc than trong cô đơn chỉ biết trông cây, Mẹ của con hộ phù và dìu con tiến bước cho thoát mọi hiểm\
nguy. Xin Mẹ lau khô hết nước mắt của con và xin Mẹ cùng bước ngày tháng biển đời âm u (trở lại điệp khúc)\
<br><br>3- Quì đây một lòng hiến dâng tâm tư con và hết cuộc đời, Mẹ hãy thương đoái nhìn và nhận cho con được luôn có Mẹ chở \
che. Trong vòng tay yêu thương Mẹ sẽ chở che thì không sợ những người ác kẻ thù quanh con (trở lại điệp khúc)\
<br><br>(*) ba thù = vô gia đình (đồng tình luyến ái), vô tổ quốc, vô tôn giáo\
<br><br>Nhạc đàn dương cầm piano để đệm hát cho bài ca Mẹ Ánh Sao Núi Ca mê lô</div>',
        loc: "tganhsao", params: ["Thơ Mẹ Dịu Ngọt", "Mẹ Ánh Sao Camêlô", "Lịch Sử", "Lễ Đức Mẹ Camêlô", "Trang Chính"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div>Xin chào mừng bạn để nghe tin mừng phước lành của Đức Mẹ Maria Núi Ca mê lô và Ơn Cứu Độ của con Mẹ. Mời bạn vào truy cập\
                tìm hiểu và chúc quí bạn và gia đình luôn được nhiều hồng ân của Mẹ Maria luôn mãi và được nhiều an ủi trong những giây phút cuối \
                cùng của cuộc sống. Thân ái trong Mẹ. Nhóm Đức Mẹ Ca mê lô\
<br><br><u>Lịch sử</u> - Trích từ Wikipedia\
<br><br>Camêlô được coi như ngọn núi thánh. Truyền thống cho rằng đây chính là nơi tiên tri Elia đã lên núi này để bảo vệ niềm tin của mình trong cơn \
bách hại, cũng như đã đào tạo những tâm hồn trung thành với Thiên Chúa. Sau đó, các ẩn sĩ được lập thành dòng Carmelô tận hiến cho Ðức Mẹ và \
sống đời chiêm niệm. Vào thế kỷ thứ XII, Thượng phụ Giáo chủ Albertô thành Giêrusalem đã qui tụ tất cả thành một nhà dòng, ban hành cho họ một \
quy luật được Giáo hoàng Hônôriô III chuẩn y năm 1226 [1]. Cũng năm ấy, Giáo hoàng cho phép mừng trọng thể trong dòng lễ Đức Bà Camêlô.\
<br><br>Vì gặp nhiều khó khăn trong giai đoạn Đất thánh bị Hồi giáo chiếm đóng, dòng Carmelô đã di chuyển về Cambridge, nước Anh. Thánh Simon Stock là \
tu viện trưởng đã kêu xin Ðức Mẹ cứu giúp [2]. Bộ áo dòng của các tu sĩ được cho là bắt nguồn từ sự kiện Đức Maria hiện ra ngày 16 tháng 7 năm \
1251 với thánh Simon Stock và nói: "Hãy nhận lấy bộ áo dòng này Mẹ ban cho dòng và cho tu sĩ như dấu chỉ của lòng ưu ái và sự săn sóc Mẹ dành \
cho các con. Đây là dấu hiệu cứu rỗi. Giải thoát mọi hiểm nguy. Ai chết mà mang biểu hiện bình an này, sẽ khỏi bị lửa thiêu đời đời và Mẹ sẽ cứu \
họ khỏi lửa luyện tội vào ngày thứ bảy sau khi họ qua đời".\
<br><br>Năm 1674, Lễ mừng Maria núi Camêlô lan rộng tới các nước có vua công giáo. Năm 1679, tới các vương quốc Áo, Bồ Đào Nha. Các nước thuộc quyền \
giáo hoàng mừng lễ này từ năm 1725. Giáo hoàng Biển Đức XIII phổ biến lễ này trong toàn Giáo hội do sắc lệnh ban hành ngày 24 tháng 9 năm 1726.\
Ngày 15 tháng 5 năm 1892, Giáo hoàng Lêô XIII đã ban đặc ân "Portiuncula" (ơn đại xá cho ai viếng nhà thờ) trong lễ này [3]. Lễ này được mừng \
trong toàn giáo hội công giáo vào ngày 16 tháng 7 hàng năm.\
<br><br><img src="http://ducme-camelo.rhcloud.com/img/Slide1.jpg" width="250" height="250"> \
<img src="http://ducme-camelo.rhcloud.com/img/Slide2.jpg" width="250" height="250">\
<img src="http://ducme-camelo.rhcloud.com/img/Slide3.jpg" width="250" height="250">\
</div>',
        loc: "tglichsu", params: ["Thơ Mẹ Dịu Ngọt", "Mẹ Ánh Sao Camêlô", "Lịch Sử", "Lễ Đức Mẹ Camêlô", "Trang Chính"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div><u>Lễ Đức Mẹ Camêlô</u> - Trích từ Dân Chúa\
<br>Linh Tiến Khải\
<br><br>Trong số các lễ nhớ Đức Mẹ, ngoài lễ Đức Mẹ Lộ Đức, Giáo Hội còn có lễ Đức Bà Camêlô. Tước hiệu Camêlô gắn liền với một dòng tu được \
thành lập trên núi Carmel trong vùng Galilea bên Palestina. Nó diễn tả một trong những hình thức phổ biến nhất về lòng sùng kính Đức Mẹ trong \
lịch sử Giáo Hội. Trong lịch phụng vụ cải tổ sau Công Đồng Chung Vaticăng II lễ này được mừng vào ngày 16 tháng 7, và là lễ nhớ không bắt buộc.\
<br><br>Carmel là một dẫy núi dài hơn 25 cây số, trải dài từ vịnh Haifa trên biển Địa Trung Hải cho tới đồng bằng Esdrelon. Chỗ cao nhất là 546 \
mét. Núi Carmel hay được Thánh Kinh nhắc tới vì cây cối xanh tươi của nó; và nói tới Carmel là nói tới vẻ đẹp và sự phong phú phì nhiêu. Chẳng \
hạn trong chương 35 ngôn sứ Isaia khích lệ thiên nhiên vui lên vì Thiên Chúa là Đấng Cứu Độ sắp tới: “Vui lên nào hỡi sa mạc và đồng khô cỏ cháy, \
vùng đất hoang hãy mừng rỡ trổ bông, hãy tưng bừng nở hoa như khóm huệ, và hân hoan múa nhảy reo hò. Sa mạc được tặng ban ánh huy hoàng của núi\
Libăng, vẻ rực rỡ của núi Carmel và đồng bằng Sharon. Thiên hạ sẽ nhìn thấy ánh huy hoàng của Giavê và vẻ rực rỡ của Thiên Chúa chúng ta” (Is 35,1-2).\
<br><br>Trong chương 7 sách Diễm Ca chàng là phu quân dùng hình ảnh núi Carmel để tả cái đẹp của nàng là hiền thê: “Trên thân mình, đầu em đỉnh núi \
Carmel, tóc em một giải lụa hồng, bềnh bồng sóng nước, xiềng xích quân vương” (Dc 7,6).\
<br><br>Nói về ngày Thiên Chúa đánh phạt Israel ngôn sứ Amos viết ở ngay đầu chương 1: “... đồng cỏ của mục tử nhuốm mầu tang tóc, đỉnh núi Carmel \
nay đã héo tàn” (Am 1,2).\
<br><br>Truyền thống gằn liền núi Carmel với ngôn sứ Elia, mặc dù Thánh Kinh Cựu Ước chỉ nhắc tới ngôn sứ một lần duy nhất. Ngày nay người A rập \
vẫn gọi núi Carmel là “Gebel Mar Elyas” “Núi thánh Elia”. Chương 18 sách các Vua I kể rằng hồi thế kỷ thứ IX trước công nguyên, vua Akháp nghe lời \
hoàng hậu Dêdabel cùng với dân Israel thuộc vương quốc miền Bắc bỏ Giavê Thiên Chúa để tôn thờ thần Baal và các thần ngoại. Trong các ngôn sứ của \
Thiên Chúa chỉ còn lại một mình Elia. Nhưng ngôn sứ can đảm dám thách đố 450 ngôn sứ giả của hoàng hậu Dêdabel trong một hy lễ toàn thiêu trên núi \
Carmel để chứng minh cho dân Israel thấy ai là Thiên Chúa thật.\
<br><br>Vì phía các ngôn sứ giả của hoàng hậu Dêdabel đông hơn, Elia nhường cho họ dâng lễ tế trước. Họ nhảy múa và dùng gươm giáo rạch mình từ sáng \
tới trưa mà không thấy các thần trả lời. Tới phiên ngôn sứ Elia, ông xếp củi, sát tế bò để lên trên, rồi sai người tưới nước ba lần ướt đầm đìa cả rãnh \
chung quanh bàn thờ, sau đó ngôn sứ cầu nguyện và lửa từ trời xuống thiêu rụi của lễ sát tế, củi, đá và bụi, và làm khô nước trong rãnh. Dân chúng phủ \
phục sát đất và tuyên xưng Chúa là Thiên Chúa. Ngôn sứ đã sai dân bắt 450 ngôn sứ giả và giết hết tại suối Kison (1 V 18,20-40). Từ đó núi Carmel được \
gắn liền với ngôn sứ Elia và cũng được gọi là “núi của ngôn sứ Elia”.\
<br><br>Vào hậu bán thế kỷ XII có một vài vị ẩn tu đã tới sống trên núi Carmel. Họ là những tín hữu tây phương đạo đức hành hương Thánh Địa, chắc hẳn \
là đi theo các đạo binh Thánh Giá cuối cùng của thời đó sang Palestina để bảo vệ các nơi thánh của Kitô giáo. Họ đã được Đức Alberto Avogadro, Thượng\
Phụ Giêrusalem giữa các năm 1206-1214, tụ họp lại với nhau thành nhóm, và viết cho họ một Quy luật sống. Trong Quy luật ấy có nói rằng “họ được thiết \
lập gần nguồn suối của ngôn sứ Elia, trong thung lũng Es-siah”, nơi lộ trình “Các khu vực của Giêrusalem”, là cuốn sách hướng dẫn hành hương biên soạn \
giữa các năm 1220-1229, chỉ cho thấy “các tu sĩ Carmel” sống bên cạnh một “nhà thờ nhỏ của Đức Bà”. Người ta không biết nhà thờ này đã được xây khi nào, \
nhưng xem ra đó là “ngôi nhà thờ nhỏ rất đẹp” được sách hướng dẫn “Các nẻo đường và các cuộc hành hương Thánh Địa” nói tới. Trong khi chúng ta không biết\
gì về một ngôi nhà thờ khác như là “công trình rất sang trọng”, được Đức Giáo Hoàng Urbano IV nói tới trong bức thư “Quoniam - Thấy rằng” đề ngày 19 tháng \
Hai năm 1263. \
<br><br>Có điều chắc chắn là lúc đó nhóm các “tu huynh” đã di cư sang cả tây phương và có tên gọi là “Dòng Đức Thánh Maria núi Carmel” theo tước hiệu \
chắc chắn đã là thói quen. Và tước hiệu này đã xuất hiện lần đầu tiên trong một tài liệu của Đức Giáo Hoàng Innocenzo IV đề ngày 13 tháng Giêng năm 1252.\
Và điều hoàn toàn chính xác đó là vào tiền bán thế kỷ XIII dòng này đã được thành lập dâng kính Đức Trinh Nữ Maria, và các tu sĩ khấn tận hiến cho Mẹ\
Thiên Chúa. Việc tận hiến này được diễn tả ra một cách nền tảng qua sự lựa chọn Đức Maria như là “Bà Chủ” của “nơi” đầu tiên trên núi Carmel. Theo ý niệm\
pháp lý thời trung cổ sự kiện này khiến cho các tu sĩ của dòng là những người hoàn toàn phục vụ Bà Chủ, với một sự tôn sùng đặc biệt. Lời khấn đối với\
Đức Maria được diễn tả ra trong cuộc sống của các tu huynh với nhiều dấu chỉ, kể cả các dấu chỉ phụng vụ, và lòng sùng mộ có tính cách cộng đoàn và cá \
nhân.\
<br><br>Chúng ta có thể nói rằng Đức Trinh Nữ Maria của núi Carmel được cảm nghiệm, tôn sùng và chiêm ngắm bởi các tu huynh và tất cả những ai sau này \
sẽ chia sẻ cuộc sống của các vị, chẳng hạn như các nữ tu, các huynh đoàn và các giáo dân dòng ba Đức Bà Camêlô. Đức Bà Camêlô là trung tâm kinh nghiệm \
tinh thần của nhóm được thành lập bên Thánh Địa với mục đích sống đời hoàn thiện theo tinh thần Phúc Âm, trong sự cô tịch chiêm niệm, tập trung nơi lời \
cầu nguyện liên lỉ, việc lắng nghe Lời Chúa, trong một bầu khí đơn sơ, nghèo nàn và trong công việc lao động, noi gương đời sống của Đức Maria tại \
Nagiarét.\
<br><br>Việc quy chiếu núi Carmel gắn liền với tên Đức Maria, chỉ đơn thuần có tính cách địa lý lịch sử, để ám chỉ nơi dòng đã khai sinh và có các tu \
huynh sống. Vì thế trong nguồn gốc của nó tước hiệu “Đức Thánh Maria của núi Camêlô” không ám chỉ một hình ảnh đặc biệt hay một khía cạnh mới của việc \
tôn sùng. Đây là điều xác đáng, vì trong việc biểu lộ cụ thể lòng sùng mộ được diễn tả ra với các tước hiệu của các nhà thờ khác nhau, các tu sĩ Camêlô \
nêu bật những khía cạnh khác nhau trong cuộc đời của Đức Maria như: chức làm Mẹ Thiên Chúa, sự đồng trinh, việc được thụ thai vô nhiễm nguyên tội, biến \
cố truyền tin. Vì vậy trong truyền thống tiên khởi “Đức Thánh Maria của núi Camêlô” chỉ đơn sơ là Đức Mẹ như thấy trong bối cảnh của Tin Mừng, là Đức \
Trinh Nữ Maria rất trong trắng, Đấng tiếp nhận lời Chúa, và với tiếng “xin vâng” của Người đã trở thành Mẹ của Con Thiên Chúa nhập thể làm người.\
<br><br>Không cần nhấn mạnh nhiều qúa, chúng ta có thể nói rằng các “tu huynh Camêlô” nhìn Đức Maria thành Nagiarét, “Nữ tỳ của Chúa”, như là Đấng gợi \
hứng, hướng dẫn, là chủ cuộc sống của họ, tập trung nơi việc giữ gìn, chiêm niệm lời Chúa. Chính vì thế các tu sĩ Camêlô cảm nghiệm Đức Maria như vừa \
là Mẹ vừa là Chị trên đường thiêng liêng, trong một bầu khí thân tình quy hướng về việc bước theo Mẹ và sống tràn đầy cuộc sống hướng thần “trong việc \
phụng sự Chúa Kitô”, trong một bầu khí đơn sơ và khổ hạnh. Đó là điều được diễn tả trong “Quy luật sống”, mà ngay từ thế kỷ XIV các tác giả của Dòng đã\
mau chóng trông thấy nhập thể nơi Mẹ Maria.\
<br><br>Trong các thánh truyện nảy sinh sau đó, có một vài truyện đã hiện diện ngay trong các bút tích đầu tiên của dòng còn được truyền tụng cho tới \
chúng ta. Chúng cho thấy việc đọc hiểu trong nhãn quan thánh mẫu “đám mây nhỏ của núi Carmel” do ngôn sứ Elia làm và đề nghị với các đồ đệ của mình. \
Chương 18 sách các Vua I kể rằng ngôn sứ Elia mời vua Akháp lên ăn uống vì ông nghe có tiếng mưa rào. Trong khi nhà vua ăn uống, thì ngôn sứ Elia lên \
đỉnh núi Carmel, cúi xuống đất gục mặt vào hai đầu gối. Rồi ông bảo đứa tiểu đồng đi lên và nhìn về phía biển. Nó đi lên nhìn và nói không có gì cả. \
Lần thứ bẩy nó nói: “Kìa, có một đám mây nhỏ bằng bàn tay người đang từ biển bốc lên. Ngôn sứ Elia nói: “Con hãy lên thưa với vua Akháp thắng xe mà \
xuống kẻo bị kẹt mưa”. Lập tức trời kéo mây đen nghịt và nổi gió rồi trút mưa lớn. Vua Akháp cỡi xe đi Izreel. Tay Giavê đặt trên Elia; ông thắt lưng\
và chạy trước vua Akháp cho tới lúc vào Izreel” (1 V 18,41-46).\
<br><br>Đám mây nhỏ ấy của núi Carmel là dấu chỉ chấm dứt cuộc hạn hán kéo dài ba năm, được các tu sĩ Camelô coi như hình ảnh diễn tả Đức Maria, đem \
mưa đến cho thế giới sau thời hạn hán. Mưa ấy là ân sủng của Thiên Chúa chấm dứt thời gian khó khăn khô cằn cho dân Israel. Mưa ân sủng ấy là Đức Giêsu \
Kitô, Đấng Cứu Thế, Nước và Bánh hằng sống Thiên Chúa ban cho nhân loại.\
<br><br>Rồi còn có truyện Đức Maria nhiều lần đến thăm cộng đoàn các tu sĩ Camêlô cùng với cha mẹ là thánh Gioakim và thánh Anna. Rồi việc sùng kính \
Đức Maria của các tu sĩ được coi là đã có từ thời xa xưa, hay ít nhất từ thời các tông đồ. Ngoài loại văn thể đạo đức đặc biệt của thời đó khiến nảy \
sinh ra các tác phẩm nghệ thuật, một cách tích cực các câu truyện thánh này diễn tả ý niệm sự thân tình theo tinh thần tin mừng đối với Mẹ Maria, \
Đấng đã tiếp nhận tu sĩ Camêlô vào “nhà của Mẹ”, và trợ giúp tu sĩ sống dấn thân theo Chúa Cứu Thế duy nhất là Đức Giêsu Kitô Con Mẹ.\
<br><br>(Thánh Mẫu Học bài 343)<br><br>Linh Tiến Khải</div>',
        loc: "rgleducme", params: ["Thơ Mẹ Dịu Ngọt", "Mẹ Ánh Sao Camêlô", "Lịch Sử", "Lễ Đức Mẹ Camêlô", "Trang Chính"],
        gotoTag: ["tgdiungot", "tganhsao", "tglichsu", "rgleducme", "main"]},
    {html: '<div><p style="color:black">Chúng con cậy vì Danh Chúa Nhân Từ và Đức Mẹ Camêlô cho các linh hồn được lên chốn nghĩ ngợi hằng xem thấy mặt Đức Chúa \
Trời Sáng Láng Vui vẽ vô cùng. Amen.</p><br>\
Trong Niềm Tin Phục Sinh của Chúa Giê Su Ki tô và Tình Thương bao la của Đức Mẹ Maria Núi Ca mê lô, chúng con xin tưởng nhớ mỗi ngày \
và cầu xin cho các linh hồn của Ông Bà, Cha Mẹ, Cô Bác, Dì Dượng Cậu Mợ, Chú Thím, Anh Chị Em, mọi người trong thân tộc, bà con, thầy cô, \
ân nhân, bằng hữu, bạn bè va các linh hồn mồ côi được sớm an nghỉ trên nước Thien Đàng và được hưởng nhan thánh của Chúa và Mẹ Maria. \
<br><br>Kính chúc an bình trong Chúa và Mẹ Maria luôn mãi.</div>',
        loc: "caulinhhon", params: ["Videos", "Trang Chính"], gotoTag: ["clhvideo", "main"]},
    {html: '<div><p style="color:black"><br>Mời bạn xem một vài bài Youtube nói về thiên đàng, luyện ngục, hỏa ngục và số phận của các linh hồn.</p></div>',
        loc: "clhvideo", params: ["Thiên Đàng Hỏa Ngục", "Luyện Ngục", "Trang Trên", "Trang Chính"], gotoTag: ["thiennguc", "luyennguc", "caulinhhon", "main"]},
    {html: '<div><p style="color:black"><br>Mời bạn xem một vài bài Youtube nói về thiên đàng, luyện ngục, hỏa ngục và số phận của các linh hồn.</p></div>',
        loc: "thiennguc", params: ["Thiên Đàng Hỏa Ngục", "Luyện Ngục", "Trang Trên", "Trang Chính"], gotoTag: ["thiennguc", "luyennguc", "caulinhhon", "main"]},
    {html: '<div><p style="color:black"><br>Mời bạn xem một vài bài Youtube nói về thiên đàng, luyện ngục, hỏa ngục và số phận của các linh hồn.</p></div>',
        loc: "luyennguc", params: ["Thiên Đàng Hỏa Ngục", "Luyện Ngục", "Trang Trên", "Trang Chính"], gotoTag: ["thiennguc", "luyennguc", "caulinhhon", "main"]},
    {html: '',
        loc: "linhhon", params: ["Tôn Kính Tử Đạo", "Trang Chính"], gotoTag: ["tudao", "main"]},
    {html: '<div>2004/03/30 VIỆT NAM (http://www.asianews.it)\
                <br><br><u>Cha Thánh Tử Đạo Diệp Được Tôn Kính Bởi Các Kitô Hữu Và Người Ngoài Kitô Giáo Như Nhau</u>\
<br><br>Bạc Liêu (AsiaNews / UCAN) - Những người hành hương đã lũ lượt đến tôn vinh những ngôi mộ của một vị linh mục tử đạo đã bị giết với \
giáo dân của mình vào ngày 12 tháng 3 năm 1946. Kỷ niệm về cái chết của Cha Francois Xavier Trương Bửu Diệp mang về hơn 30.000 người Công giáo,\
Tin lành và người ngoài Kitô giáo đến giáo xứ Tắc Sậy ở tỉnh Bạc Liêu, 1.990 km về phía nam của Hà Nội, để cung cấp sự tôn trọng và lòng biết \
ơn với người đàn ông thánh xưa nhiều người nói là chịu trách nhiệm cho việc chữa bệnh của các bệnh thể chất, tăng sự thịnh vượng và may mắn. \
Các linh mục giáo xứ hiện nay Cha Jean Baptiste Trần Đức Hùng đã dẫn đầu một kỷ niệm Thánh Lễ ngoài trời với 18 linh mục khác, đánh dấu ngày \
tử đạo của Điệp 60 năm trước. \
<br><br>Cha Diệp được sinh ra vào năm 1897 và được thụ phong linh mục năm 1924, sau khi hoàn thành nghiên cứu tại Phnom Penh Đại Chủng viện tại\
Campuchia. Trong suốt thời gian của mình như là một linh mục ở Việt Nam, đất nước bị tàn phá với sự xung đột giữa các phe phái tôn giáo và chính \
trị, và ông đã được thông báo bởi một giáo hội cấp trên để rời khỏi khu vực an toàn hơn cho một ai. \"Tôi sống giữa đoàn chiên của tôi và tôi sẽ \
chết trong đó. Tôi sẽ không đi đâu cả\" linh mục nói. Sau đó, ông và 30 giáo dân bị bắt bởi lực lượng của đối phương và tổ chức tại một kho chứa \
lúa gạo. Cơ thể của linh mục sau đó được tìm thấy trong một cái ao gần đó, mặc dù chính quyền không đồng ý người đã giết ông, và tại sao.\
<br><br>Bây giờ khách hành hương xếp hàng để chạm vào ngôi mộ và bức tượng của ông và tặng quà của hương, nến, tiền bạc, thức ăn và cầu nguyện.\
Trong lễ kỷ niệm, các tín hữu đã mang con lợn sữa quay, heo quay, bánh, hoa và trái cây ở vị trí trên bảng ở phía trước của ngôi đền. Nhà trọ \
địa phương đã được lấp đầy với năng lực, sạc ba lần giá thường xuyên để các du khách sẵn sàng. Một khách hành hương cũ 60 năm từ Thành phố Hồ \
Chí Minh cho biết, nhóm 50 thành viên của bà đã may mắn tìm thấy một nơi để ngủ trên bậc thềm của nhà xứ. \"Cha Diệp chữa khỏi cho tôi ngay sau \
khi tôi đến thăm ngôi mộ của ông,\" cô nói, đề cập đến viêm khớp nặng mà trước đây đã ngăn cản cô từ đi bộ đúng cách. Kể từ đó, cô đến hàng năm \
để cảm ơn anh, đưa bạn bè ai cũng tìm kiếm ủng hộ vật chất và tinh thần. Hàng ngàn khách hành hương đã để lại những biểu hiện của lòng biết ơn \
cho những lời cầu nguyện đã trả lời với các phiến đá nhỏ được chạm khắc với những từ ngữ, \"Biết ơn Cha Diệp\" để được đặt trên các bức tường xung \
quanh nhà thờ. Nhiều người Việt Nam ở nước ngoài cũng đến và cầu nguyện cho các linh mục cuối. Cha Hùng nói rằng giáo hội đã trở thành một địa điểm \
hành hương nổi tiếng trong khu vực kể từ năm 1980, sau khi báo cáo của lời cầu nguyện đã trả lời lu truyền trong nhân dân. Nó được chính thức công \
nhận là một địa điểm hành hương của giáo phận năm 1996.\
<br><br>Ngày 24 Tháng Hai, Giám Mục Emmanuel Lê Phong Thuận Cần Thơ cử hành Thánh Lễ, để đánh dấu sự khởi đầu của việc xây dựng một nhà thờ giáo \
xứ 2.000 chỗ ngồi để thay thế các cấu trúc hiện tại được xây dựng vào năm 1963. Các cộng đồng Tac Say Công giáo, được thành lập vào năm 1925 với \
200 giáo dân, doanh nghiệp có 1.500 người Công giáo.</div>',
        loc: "tudao", params: ["Trang Trên", "Trang Chính"], gotoTag: ["linhhon", "main"]},
    {html: '<div><u>Kinh Ngày thường</u> \
<br>(Chúa Nhật tới thứ bảy)   \
<br><br><u>Kinh sáng</u> \
<br><br>Kinh Chúa Thánh Thần \
<br>Kinh Sáng Chúa Mạc Khải của Thánh Brigitta \
<br>Lòng Chúa Thương Xót của Thánh Faustina \
<br>Kinh chuỗi Đức Mẹ Mân Côi & Kinh Đức Mẹ Ca mê lô - Cầu cho các linh hồn \
<br><br><u>3pm Kinh Chiều lúc Chúa Chết</u> \
<br><br>Kinh Chúa Thánh Thần \
<br>Kinh Lòng Chúa Thương Xót \
<br>Kinh 14 chẳng đằng thánh giá \
<br>Kinh Chúa Mạc khải \
<br>Kinh Giesu Maria Giuse con mến yêu cho các linh hồn. Kinh Đức Mẹ Ca mê lô \
<br><br><u>Kinh Tối</u> \
<br><br>Kinh Chúa Thánh Thần \
<br>Kinh Chúa Mạc Khải \
<br>Kinh Lòng Chúa Thương Xót \
<br>Kinh Đức Mẹ Ca mê lô - Kinh Mân côi - Kinh cầu cho các linh hồn \
<br><br>Xin Chúa Ngôi Ba đoái thương viếng thăm. \
<br>Soi lòng con đầy u mê tối tăm. \
<br>Hộ giúp con cầm trí cầu xin nên. \
<br>Mở miệng cao rao Thánh Danh Người luôn.\
<br><br>Oh Chúa Thánh Thần, giúp chúng ta ghi nhớ và biết ơn Chúa Giêsu cứu rỗi của Death của Ngài trên thập giá và phục sinh mà Thiên Chúa đã \
yêu thương chúng ta, tha thứ cho tội lỗi của chúng ta và cho chúng ta một cơ hội để có life đời trên thiên đàng với Ngài nếu chúng ta yêu thương \
tất cả mọi người xung quanh chúng ta. Hãy dạy và cho chúng ta can đảm vì vậy chúng tôi có thể yêu thương, tha thứ và chấp nhận tất cả mọi người \
vì họ đều là anh chị em của chúng ta trong Chúa Kitô, đặc biệt là người nghèo, người bất hạnh, người bệnh, người bị từ chối, không mong muốn, bị \
khinh miệt ... kẻ thù của chúng tôi, của chúng tôi ghét .... bởi vì chúng ta là con cả của Thiên Chúa. \
<br><br><u>Small Fellowship Groups</u> \
<br><br>2nd & 4th Friday nights of month,7pm @\
<br>TBD \
<br>Topical Discussions & fellowship\
<br>Contact for details</div>',
        loc: "caunguyen", params: ["Video", "Trang Chính"], gotoTag: ["cnvideo", "main"]},
    {html: '<div><div><p style="color:black"><br>MADE IN GOD video dưới đây cho thấy làm thế nào một con sư tử thể hiện tình yêu của mình ...</p> \
<br><iframe width="760px" height="550px" src="https://www.youtube.com/embed/NLB_u695wTg" frameborder="0" allowfullscreen></iframe></div>',
        loc: "cnvideo", params: ["Trang Trên", "Trang Chính"], gotoTag: ["caunguyen", "main"]},
    {html: '<div class="fullcaldiv"><select id="monthBox" class="monthbox" onChange="changeMonthYearData();"></select><div id="calendar"></div></div>',
        // {html: '<div><iframe src="https://www.google.com/calendar/embed?src=en.usa%23holiday@group.v.calendar.google.com&amp;mode=MONTH&amp;showTitle=0&amp;showNav=1&amp;showDate=1&amp;showTabs=1&amp;showCalendars=0&amp;hl=vi" title="US Holidays" width="100%" height="600" frameborder="0" scrolling="no"></iframe></div>',
        loc: "lich", params: ["Trang Chính"], gotoTag: ["main"]},
    {html: '<div><img src="http://ducme-camelo.rhcloud.com/img/Thanh.jpg" width="250" height="250">\
<br><br>Cecilia Thanh Nguyễn, Associate Science Degree  - theo bán cử nhân 2 năm và chuyển viên về ngành thẩm mỹ. Sở thích về tham khảo và đọc sách.\
<br><br><img src="http://ducme-camelo.rhcloud.com/img/Tuyen.jpg" width="250" height="250">\
<br><br>Maria Lê Bích Tuyền, Bachelor of Science, Cử Nhân và Giáo sư ngành thẩm mỹ, Sở thích về sức khoẻ và dinh dưỡng. Cựu học sinh trường Thiên Phước, Tân Định, Saigon (1970-1975)\
<br><br><img src="http://ducme-camelo.rhcloud.com/img/Quang.jpg" width="250" height="250">\
<br><br>Micae Nguyễn Xuân Quang, MS Cao học về ngành kỹ sư hóa học và quản trị xí nghiệp. Sở thích về dinh dưỡng, thể dục và sinh hoạt nhóm. Cựu học sinh trường Lasan Đức Minh Tân\
Định, Saigon - (1959-1966), DHTN, Christian Brothers University, Vanderbilt, UH</div>',
        loc: "giadinh", params: ["Trang Chính"], gotoTag: ["main"]},
    {html: '<div id="maincontent"></div>',
        loc: "danhba", params: ["Trang Chính"], gotoTag: ["main"]},
    {html: '<br>Chúng tôi xin được hân hạnh và cảm ơn tất cả mọi ý kiến đóng góp của bạn đọc để làm cho trang mạng tốt hơn trong việc truyền thông \
thông điệp của trang mạng tới cho mọi người. Xin cảm ơn quí bạn đọc và chúc bạn được mọi ơn \
lành trong cuộc sống.\
<br><br>Tên:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comname" type="text" size="30" value=""> (Cần thiết)\
<br><br>Email:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comemail" type="text" size="50" value=""> (Cần thiết)\
<br><br>Điện Thoại:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comphone" type="text" size="10" value="">\
<br><br>Chủ Đề:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="comsubject" type="text" size="100" value=""> (Cần thiết)\
<br><br><div>Lời Nhắn: (Cần thiết)<br><textarea style="color:black; background-color:lightgray;" id="comcontent" spellcheck="true" rows="20" cols="98"></textarea>\
<br><br><input class="centerbutton" type="button" onclick="Email([\'comname\', \'comemail\', \'comsubject\', \'comcontent\'],\'comphone\')" value="Gửi Đến Chúng Tôi"></input> </div>\
<div id="emailMsg"></div>\
<img class="centerIcon" src="http://ducme-camelo.rhcloud.com/img/commentbox.gif">',
        loc: "lienhe2", params: ["Trang Chính"], gotoTag: ["main"]},
    {html: 'Yêu cầu cầu nguyện trực tuyến của bạn sẽ mở cửa, và Đức Chúa Trời đang kiên nhẫn chờ đợi ở phía bên kia cánh cửa đó,\
mọi lúc, trong mọi tình huống, tham gia với bạn. <br><br>Yêu cầu cầu nguyện của bạn được nhận bởi đội Prayer Yêu cầu của chúng tôi, những người \
sẽ cầu nguyện cho bạn. <br><br>Hãy biết rằng bạn là một con thánh và quý giá của Thiên Chúa, và Thiên Chúa luôn ở với bạn. <br><br>Nhiều phước lành cho bạn, \
<br><br>Nhóm Cầu Nguyện Yêu cầu của chúng tôi.\
<br><br>Tên:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="prayname" type="text" size="30" value=""> (Cần thiết)\
<br><br>Email:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="prayemail" type="text" size="50" value=""> (Cần thiết)\
<br><br>Điện Thoại:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="prayphone" type="text" size="10" value="">\
<br><br>Chủ Đề:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" id="praysubject" type="text" size="100" value=""> (Cần thiết)\
<br><br><div>Lời Nhắn: (Cần thiết)<br><textarea style="color:black; background-color:lightgray;" id="praycontent" spellcheck="true" rows=20" cols="98"></textarea>\
<br><input class="centerbutton" type="button" onclick="Email([\'prayname\', \'prayemail\', \'praysubject\', \'praycontent\'],\'prayphone\')" value="Gửi Yêu Cầu"></input> </div>\
<div id="emailMsg"></div> \
<img class="centerIcon" src="http://ducme-camelo.rhcloud.com/img/prayer-requests.png">',
        loc: "dockinh", params: ["Trang Chính"], gotoTag: ["main"]},
    {html: '<div class="mapContent"><div><span style="color:black;">Trước tiên, hãy chọn một trong hai tùy chọn Find hoặc Get Direction. Sau đó, hoặc chọn Google hay Auto chọn Complete nếu bạn muốn cho \
    Google để cảm nhận đánh máy của bạn và cung cấp một danh sách các địa điểm có thể hoặc bằng tay tùy chọn Input nếu bạn có địa chỉ chính xác mà bạn muốn gõ vào.</span><br><br>'
                + '<form style="float:left">'
                + '<input id="find" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="1" ><span style="color:black;">Find</span>'
                + '<input id="direction" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="2"><span style="color:black;">Get Direction</span>'
                + '</form>'
                + '<span style="color:black;float:left;">&nbsp;&nbsp;<u>USING</u>&nbsp;&nbsp;</span>'
                + '<form style="float:left">'
                + '<input id="autofind" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="3"><span style="color:black;">Google Auto Complete</span>'
                + '<input id="manualfind" style="color:black; background-color:lightgray;" type="radio" name="lang" onclick="handleClick(' + "'map'" + ', this);" value="4"><span style="color:black;">Manual Input</span>'
                + '</form>'
                + '<br /><br />'
                + '<div style="clear:both" id="mapinput">'
                + '<span style="color:black;">Location:&nbsp;&nbsp;<input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapfind" type="text" value="">&nbsp;'
                + '</div>'
                + '<br>'
                + '<span style="color:black;">Kéo hình nhân vàng đến chỗ bạn muốn ngắm nhìn toàn cảnh đường phố.</span><br>'
                + '<div id="mappanel">'
                + '<div id="map-canvas" style="width:800px; height:500px;"></div>'
                + '</div>'
                + '<div id = "pano" style = "clear:both;width:800px; height:500px;"></div></div></div>',
        loc: "bando", params: ["Trang Chính"], gotoTag: ["main"]},
    {html: '<br><div class="email"><div><p style="color:black;">&nbsp;&nbsp;<u>Hương Lòng Dâng Mẹ</u> (Bạn có thể để cho máy nghe nhạc tự động chơi và lặp lại hoặc bạn có thể nhấp chuột vào tên bài hát.)</p></div>'
                + '<select id="SongLink" hidden="true"></select>'
                + '<select id="PicLink" hidden="true"></select>'
                + '<br /><br />'
                + '<select id="Title" name="MusicList" size="5" class="nhaclist" onclick="MusicLoad(Title.selectedIndex,' + "'nhac'" + ')"></select>&nbsp;&nbsp;'
                + '<div id="musicavatar" class="nhac">'
                + '</div>'
                + '<br><br><br><br><br><br><br><br><br><br><br><br><br><br>'
                + '&nbsp;<audio id="audio" autoplay controls onended="mEnd()" onerror="mError()" ></audio>'
                + '</div>',
        loc: "nhac", params: ["Radio Hằng Ngày", "Trang Chính"], gotoTag: ["radio", "main"]},
    {html: '<br><div class="email"><div><p style="color:black;">&nbsp;&nbsp;<u>Mẹ Hằng Cứu Giúp</u> (Bạn có thể để cho máy nghe nhạc tự động chơi và lặp lại hoặc bạn có thể nhấp chuột vào tiêu đề radio.)</p></div>'
                + '<select id="SongLink" hidden="true"></select>'
                + '<select id="PicLink" hidden="true"></select>'
                + '<br /><br />'
                + '<select id="Title" name="MusicList" size="5" class="nhaclist" onclick="MusicLoad(Title.selectedIndex,' + "'nhac'" + ')"></select>&nbsp;&nbsp;'
                + '<div id="musicavatar" class="nhac">'
                + '</div>'
                + '<br><br><br><br><br><br><br><br><br><br><br><br><br><br>'
                + '&nbsp;<audio id="audio" controls autoplay onended="mEnd()" onerror="mError()" ></audio>'
                + '</div>',
        loc: "radio", params: ["Trang Trên", "Trang Chính"], gotoTag: ["nhac", "main"]},
    {html: '<br><div class="email"><div><p style="color:black;">&nbsp;&nbsp;<u>Mẹ Hằng Cứu Giúp</u> (Bạn có thể để cho máy nghe nhạc tự động chơi và lặp lại hoặc bạn có thể nhấp chuột vào tiêu đề radio.)</p></div>'
                + '<select id="SongLink" hidden="true"></select>'
                + '<select id="PicLink" hidden="true"></select>'
                + '<br /><br />'
                + '<select id="Title" name="MusicList" size="5" class="nhaclist" onclick="MusicLoad(Title.selectedIndex,' + "'nhac'" + ')"></select>&nbsp;&nbsp;'
                + '<div id="musicavatar" class="nhac">'
                + '</div>'
                + '<br><br><br><br><br><br><br><br><br><br><br><br><br><br>'
                + '&nbsp;<audio id="audio" controls autoplay onended="mEnd()" onerror="mError()" ></audio>'
                + '</div>',
        loc: "search", params: ["Trang Chính"], gotoTag: ["main"]}
];

function searchSiteFor() {
    console.log(document.getElementById("search").value);
}

function changeMonthYearData() {//(optionBox) { 
    var m = document.getElementById("monthBox");
    //  console.log(new Date().getFullYear());
    var date = new Date();
    $('#calendar').fullCalendar('gotoDate', new Date(date.getFullYear(), m.selectedIndex, 1));
}

function clearLogs() {
    setTimeout(function () { // delay
        $.post(Server, {"CLEARLOGS": "type=clear"}, function (data) { // sending ajax post request
        });
    }, 50);
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

function printMsg(id, msg) {
    document.getElementById(id).innerHTML = '<div id="' + id + '"><p>' + msg + '</p></div>';
}

function getValueForLanguage(array) {
    if (langSelected.localeCompare('Vietnamese') === 0) {
        return array[0];
    }
    if (langSelected.localeCompare('English') === 0) {
        return array[1];
    }
    if (langSelected.localeCompare('Spanish') === 0) {
        return array[2];
    }
}

function setTable(array, row) {
    var divStr = '<div id="content"><table id="table" bgcolor="lightgray" style="width:809px">\
                <caption><b>' + headers[row][0] + '</b></caption>\
                <thead>\
                    <tr>\
                        <th onclick="tableHeaderClicked()" class="sortable">' + headers[row][1] + '</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">' + headers[row][2] + '</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">' + headers[row][3] + '</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">' + headers[row][4] + '</th>\
                        <th onclick="tableHeaderClicked()" class="sortable">' + headers[row][5] + '</th>\
                    </tr>\
                </thead><tbody>';
    for (var i = 0; i < array.length; i++) {
        // console.log(array[i]); //return;
        var temp = array[i].split(',');
        var first = temp[0].split(';');
        var last = temp[1].split(';');
        var title = temp[2].split(';');
//        console.log(temp[0] + "  " + temp[5]); //return;
        divStr += '<tr class="members">'
                + '<td>' + getValueForLanguage(first) + '</td>'
                + '<td>' + getValueForLanguage(last) + '</td>'
                + '<td>' + getValueForLanguage(title) + '</td>'
                + '<td>' + temp[3] + '</td>'
                + '<td>' + temp[4] + '</td>'
                + '</tr>';
    }
    divStr += '</tbody></table></div>';
    $("#maincontent").replaceWith(divStr);
}

function setEnv(mode, table, tag) {
    if (tag.localeCompare("none") !== 0)
        document.getElementById("dbtitle").innerHTML = '<div id="dbtitle"><p><u>' + tag + '</u></p></div>';
    dbmode = mode;
    dbtable = table;
    selRowContent = "&id=1&first=1&last=1&title=1&phone=1&email=1&table=" + dbtable + "&mode=" + dbmode;
    accessMemberDatabase("cellClicked refresh", "0");
}

function accessMemberDatabase(tag, code) {
    var params = "code=" + code + selRowContent;
    var retArray = new Array();
    //  var parameters = [{"HUAINS": "code=0"}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}, {"HUAINS": params}];
    setTimeout(function () { // delay 
        //console.log("accessMemberDatabase  " + params);
        $.post(Server, {"DATABASE": params}, function (data) { // sending ajax post request
            var temp = JSON.stringify(data);
            //console.log(temp);
            retArray = JSON.parse(temp);
            numMembers = retArray.length;
            if (dbmode.localeCompare('view') === 0)
                setTable(retArray, headerrow);
            else
                setTableMgr(retArray);
        });
    }, 50);
}

function CreateTagAlbumDiv(avatar, which) {
    whichAvatar = avatar;
    mTagDivId = which;
    var divStr = '<div id="' + whichAvatar + '" class="nhac">'
            + '<div class="rotate_album">'
            + '<img class="rotate" width="300" height="300" src="https://c3.staticflickr.com/3/2881/12805769725_c8552d5836_h.jpg">'
            + '</div>'
            + '<div id="' + mTagDivId + '" class="box_tag_album">'
            + '<img width="410" height="320" src="http://i1322.photobucket.com/albums/u579/rong4ever/Photobucket%20Desktop%20-%20NSWCDD-D0065DC2/Misc/cdplayer_zps036bb78c.png?t=1414985479">'
            + '</div>'
            + '<div class="box_bg_album">'
            + '<img width="300" height="317" src="http://ducme-camelo.rhcloud.com/mp3/TNCD409-front.jpg">'
            + '</div>'
            + '</div>';
    document.getElementById(whichAvatar).innerHTML = divStr;
}

function PHPSetAlbum(t, code, params, pic) { // waiting for event to be fired
    type = t;
    // CheckSetList();
    audio = document.getElementById('audio');
    audio.pause();
    //var spinStr = '<div id="' + spinDivId + spinWaitEndStr;
    //document.getElementById(spinDivId).innerHTML = spinStr;
    var parameters = [{"ALBUM": params}, {"ALBUMS": params}, {"MALBUM": params}, {"MALBUMS": params}, {"GETMHCG": params}, {"GETNVRADIO": params}, {"GETNHACSONET": params}];
    //console.log("PHPSetAlbum params " + params);
    // https://github.com/rongcon2/RongForever.git
    if (isNaN(code) === false) { // string is a number
        setTimeout(function () { // delay 
            // //console.log("sending PHP ALBUM");
            $.post(Server, parameters[parseInt(code)], function (data) { // sending ajax post request
                var temp = JSON.stringify(data);
                //console.log(temp); //return;
                retArray = JSON.parse(temp);
                var stat = retArray[0] + retArray[1];
                if (stat.localeCompare("NA") === 0) {
                    DisplayNAMessage();
                    return;
                }
                process(retArray, pic);
            });
        }, 50);
    }
    else { // regular radios
        var array = new Array();
        var res = params.split(separator); // sense semicolon
        array.push(res[1]);
        if ((res[0].localeCompare("stream.mp3") === 0) || (res[0].localeCompare("stream.nsv") === 0)) {
            array.push(res[2] + ';' + res[0]);
            audioType = 'stream';
        } else {
            array.push(res[2]);
            audioType = 'mp3';
        }
        process(array, pic);
    }
}

function process(array, pic) {

    TList = document.getElementById("Title");
    SList = document.getElementById("SongLink");
    if (array.length > 0) {
        TList.options.length = 0;
        SList.options.length = 0;
        var i = 0;
        var j = 0;
        var idx = 0;
        var len = (array.length / 2);
        //console.log(len);
        for (idx = 0; idx < len; idx++) {
            if (array[idx].length > 0) {//if (retArray[idx].localeCompare(" - ") !== 0) {
                if (idx < 10)
                    TList.options[TList.options.length] = new Option(' ' + (i + 1) + ". " + array[idx], i);
                else
                    TList.options[TList.options.length] = new Option((i + 1) + ". " + array[idx], i);
                //console.log("TLIST " + TList.options[i].text);
                i++;
            }
        }
        for (idx = len; idx < array.length; idx++) {
            if (array[idx].length > 0) {
                SList.options[SList.options.length] = new Option(array[idx], j);
                //console.log("SLIST " + SList.options[j].text);
                j++;
            }
        }
        // return;
        //document.getElementById(spinDivId).innerHTML = '<div id="' + spinDivId + '" class="labeled"></div>';
        var avatarStr = '<div id="' + whichAvatar + '" class="nhac">'
                + '<div class="rotate_album">'
                + '<img class="rotate" width="300" height="300" src="' + pic + '">'
                + '</div>'
                + '<div id="' + mTagDivId + '" class="box_tag_album">'
                + '<img width="410" height="320" src="http://i1322.photobucket.com/albums/u579/rong4ever/Photobucket%20Desktop%20-%20NSWCDD-D0065DC2/Misc/cdplayer_zps036bb78c.png?t=1414985479">'
                + '</div><div class="box_bg_album"><img width="300" height="317" src="' + pic + '"></div></div>';
        //   + '"></div></div>';

        document.getElementById(whichAvatar).innerHTML = avatarStr;
        MusicLoad(0, type);
        //alert("TLIST " + TList.options.length);
        //alert("SLIST " + SList.options.length);   
    }
}
function MusicLoad(i, t) {
    type = t;
    //CheckSetList();
    audio.setAttribute("type", "audio/mp3");
    audio.setAttribute("src", SList.options[i].text);
    //  if (audioType.localeCompare('stream') === 0)
    //      audio.setAttribute("type", "audio/mpeg");
    audio.volume = 0.3;
    audio.load();
    ind = i;
    TList.selectedIndex = i;
    // PList.options[i].value -> object tag
    // PList.options[i].text -> object tag's value
}
function mEnd() {
// PROBLEM: when both music and story player running...default to last list being clicked on
    ind = ind + 1;
    if (ind >= TList.length)
        ind = 0;
    MusicLoad(ind, type);
}
function mError() {
// PROBLEM: when both music and story player running...default to last list being clicked on
//if (audio.error.code === 4) {
//    audio.setAttribute("src", address + music[ind] + '.asx');
//    audio.load();
//}
    MusicLoad(ind, type);
}

function Email(ids, phoneId) {
    var prefix = ["Vui lòng nhập ", "Please enter ", "Por favor, introduzca "];
    //  var ids = ['comname', 'comemail', 'comsubject', 'comcontent'];
    var error = [
        ["tên", "name", "nombre"],
        ["email", "email", "email"],
        ["chủ đề", "subject", "sujeto"],
        ["lời nhắn", "message", "messae"]
    ];
    var str = "";
    var divStr = "";
    var errFound = 0;
    for (var index = 0; index < ids.length; ++index) {
        if (document.getElementById(ids[index]).value.length === 0) {
            errFound++;
            if (langSelected.localeCompare('Vietnamese') === 0) {
                if (errFound === 1)
                    str += prefix[0];
                str += error[index][0] + ", ";
            }
            if (langSelected.localeCompare('English') === 0) {
                if (errFound === 1)
                    str += prefix[1];
                str += error[index][1] + ", ";
            }
            if (langSelected.localeCompare('Spanish') === 0) {
                if (errFound === 1)
                    str += prefix[2];
                str += error[index][2] + ", ";
            }
        }
    }

    if (errFound > 0) {
        var errMsg = str.replace(/, $/, "") + "."; // remove last comma ", " and add period at end
        divStr += '<div align="center" id="emailMsg"><p style="color:black;">' + errMsg + ' </p></div>';
        $("#emailMsg").replaceWith(divStr);
        setTimeout(function () { // delay              
            $("#emailMsg").replaceWith('<div id="emailMsg"></div>');
        }, 4000);
        return;
    }
    //console.log(document.getElementById(subjId).value);
    //console.log(document.getElementById(contentId).value);
    var param = "type=" + ids[2] +
            "&name=" + document.getElementById(ids[0]).value +
            "&email=" + document.getElementById(ids[1]).value +
            "&phone=" + document.getElementById(phoneId).value +
            "&subj=" + document.getElementById(ids[2]).value +
            "&content=" + document.getElementById(ids[3]).value;
    setTimeout(function () { // delay   
        $.post(Server, {"EMAIL": param}, function (data) { // sending ajax post request
            var temp = JSON.stringify(data);
            //console.log(temp);//return;
            var result = JSON.parse(temp);
            var divStr = "";
            if (result.localeCompare("DONE") === 0) {
                if (langSelected.localeCompare('Vietnamese') === 0) {
                    divStr += '<div align="center" id="emailMsg"><p style="color:black;">Bản viết của bạn đã được gửi đi. Cám ơn.</p></div>';
                }
                if (langSelected.localeCompare('English') === 0) {
                    divStr += '<div align="center" id="emailMsg"><p style="color:black;">Your input has been sent. Thank You.</p></div>';
                }
                if (langSelected.localeCompare('Spanish') === 0) {
                    divStr += '<div align="center" id="emailMsg"><p style="color:black;">Su aportación ha sido enviado. Gracias.</p></div>';
                }
                $("#emailMsg").replaceWith(divStr);
                setTimeout(function () { // delay              
                    $("#emailMsg").replaceWith('<div id="emailMsg"></div>');
                }, 4000);
            }
        });
    }, 50);
}

function getMenuGotoIndex(gototag) {
    for (var idx = 0; idx < menuViet.length; idx++) {
        if (gototag.localeCompare(menuViet[idx].loc) === 0) {
            return idx;
        }
    }
}

function CreatePhotoAlbum(which, prefix, numImg) {
    var picStr = '<div id="mypic" u="slides" style="cursor: move; position: absolute; left: 0px; top: 0px; width: 800px; height: 700px; overflow: hidden;">';
    //console.log(prefix);
    for (var index = 0; index < numImg; index++) {
        if (which.localeCompare("linhhon") === 0) {
            picStr += '<div>'
                    + '<img u="image" src="' + prefix + "Slide" + (index + 1) + '.jpg" />'
                    + '<img u="thumb" src="' + prefix + "Slide" + (index + 1) + '.jpg" />'
                    + '</div>';
        }
        if (which.localeCompare("caulinhhon") === 0) {
            picStr += '<div>'
                    + '<img u="image" src="' + prefix + cauLinhHon[0].img[index] + '">'
                    + '<img u="thumb" src="' + prefix + cauLinhHon[0].img[index] + '">'
                    + '</div>';
        }
    }
    picStr += '</div>';
    //console.log(picStr);
    var divStr = slideAlbumBeginStr
            + picStr
            + slideAlbumEndStr;
    $("#album").replaceWith(divStr);
    loadPicAlbum("album", true);
}

function loadPicAlbum(displayDiv, autoplay) {

    var SlideshowTransitions = [
        //Fade in L
        {$Duration: 1200, x: 0.3, $During: {$Left: [0.3, 0.7]}, $Easing: {$Left: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}
//Fade out R
        , {$Duration: 1200, x: -0.3, $SlideOut: true, $Easing: {$Left: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}
//Fade in R
        , {$Duration: 1200, x: -0.3, $During: {$Left: [0.3, 0.7]}, $Easing: {$Left: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}
//Fade out L
        , {$Duration: 1200, x: 0.3, $SlideOut: true, $Easing: {$Left: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}

//Fade in T
        , {$Duration: 1200, y: 0.3, $During: {$Top: [0.3, 0.7]}, $Easing: {$Top: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2, $Outside: true}
//Fade out B
        , {$Duration: 1200, y: -0.3, $SlideOut: true, $Easing: {$Top: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2, $Outside: true}
//Fade in B
        , {$Duration: 1200, y: -0.3, $During: {$Top: [0.3, 0.7]}, $Easing: {$Top: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}
//Fade out T
        , {$Duration: 1200, y: 0.3, $SlideOut: true, $Easing: {$Top: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}

//Fade in LR
        , {$Duration: 1200, x: 0.3, $Cols: 2, $During: {$Left: [0.3, 0.7]}, $ChessMode: {$Column: 3}, $Easing: {$Left: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2, $Outside: true}
//Fade out LR
        , {$Duration: 1200, x: 0.3, $Cols: 2, $SlideOut: true, $ChessMode: {$Column: 3}, $Easing: {$Left: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2, $Outside: true}
//Fade in TB
        , {$Duration: 1200, y: 0.3, $Rows: 2, $During: {$Top: [0.3, 0.7]}, $ChessMode: {$Row: 12}, $Easing: {$Top: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}
//Fade out TB
        , {$Duration: 1200, y: 0.3, $Rows: 2, $SlideOut: true, $ChessMode: {$Row: 12}, $Easing: {$Top: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}

//Fade in LR Chess
        , {$Duration: 1200, y: 0.3, $Cols: 2, $During: {$Top: [0.3, 0.7]}, $ChessMode: {$Column: 12}, $Easing: {$Top: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2, $Outside: true}
//Fade out LR Chess
        , {$Duration: 1200, y: -0.3, $Cols: 2, $SlideOut: true, $ChessMode: {$Column: 12}, $Easing: {$Top: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}
//Fade in TB Chess
        , {$Duration: 1200, x: 0.3, $Rows: 2, $During: {$Left: [0.3, 0.7]}, $ChessMode: {$Row: 3}, $Easing: {$Left: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2, $Outside: true}
//Fade out TB Chess
        , {$Duration: 1200, x: -0.3, $Rows: 2, $SlideOut: true, $ChessMode: {$Row: 3}, $Easing: {$Left: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}

//Fade in Corners
        , {$Duration: 1200, x: 0.3, y: 0.3, $Cols: 2, $Rows: 2, $During: {$Left: [0.3, 0.7], $Top: [0.3, 0.7]}, $ChessMode: {$Column: 3, $Row: 12}, $Easing: {$Left: $JssorEasing$.$EaseInCubic, $Top: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2, $Outside: true}
//Fade out Corners
        , {$Duration: 1200, x: 0.3, y: 0.3, $Cols: 2, $Rows: 2, $During: {$Left: [0.3, 0.7], $Top: [0.3, 0.7]}, $SlideOut: true, $ChessMode: {$Column: 3, $Row: 12}, $Easing: {$Left: $JssorEasing$.$EaseInCubic, $Top: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2, $Outside: true}

//Fade Clip in H
        , {$Duration: 1200, $Delay: 20, $Clip: 3, $Assembly: 260, $Easing: {$Clip: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}
//Fade Clip out H
        , {$Duration: 1200, $Delay: 20, $Clip: 3, $SlideOut: true, $Assembly: 260, $Easing: {$Clip: $JssorEasing$.$EaseOutCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}
//Fade Clip in V
        , {$Duration: 1200, $Delay: 20, $Clip: 12, $Assembly: 260, $Easing: {$Clip: $JssorEasing$.$EaseInCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}
//Fade Clip out V
        , {$Duration: 1200, $Delay: 20, $Clip: 12, $SlideOut: true, $Assembly: 260, $Easing: {$Clip: $JssorEasing$.$EaseOutCubic, $Opacity: $JssorEasing$.$EaseLinear}, $Opacity: 2}
    ];
    var options = {
        $FillMode: 1, //[Optional] The way to fill image in slide, 0 stretch, 1 contain (keep aspect ratio and put all inside slide), 2 cover (keep aspect ratio and cover whole slide), 4 actual size, 5 contain for large image, actual size for small image, default value is 0
        $AutoPlay: autoplay, //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
        $AutoPlayInterval: 2500, //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
        $PauseOnHover: 1, //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1

        $DragOrientation: 3, //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
        $ArrowKeyNavigation: true, //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
        $SlideDuration: 800, //Specifies default duration (swipe) for slide in milliseconds

        $SlideshowOptions: {//[Optional] Options to specify and enable slideshow or not
            $Class: $JssorSlideshowRunner$, //[Required] Class to create instance of slideshow
            $Transitions: SlideshowTransitions, //[Required] An array of slideshow transitions to play slideshow
            $TransitionsOrder: 1, //[Optional] The way to choose transition to play slide, 1 Sequence, 0 Random
            $ShowLink: true                                    //[Optional] Whether to bring slide link on top of the slider when slideshow is running, default value is false
        },
        $ArrowNavigatorOptions: {//[Optional] Options to specify and enable arrow navigator or not
            $Class: $JssorArrowNavigator$, //[Requried] Class to create arrow navigator instance
            $ChanceToShow: 1                               //[Required] 0 Never, 1 Mouse Over, 2 Always
        },
        $ThumbnailNavigatorOptions: {//[Optional] Options to specify and enable thumbnail navigator or not
            $Class: $JssorThumbnailNavigator$, //[Required] Class to create thumbnail navigator instance
            $ChanceToShow: 2, //[Required] 0 Never, 1 Mouse Over, 2 Always

            $ActionMode: 1, //[Optional] 0 None, 1 act by click, 2 act by mouse hover, 3 both, default value is 1
            $SpacingX: 8, //[Optional] Horizontal space between each thumbnail in pixel, default value is 0
            $DisplayPieces: 10, //[Optional] Number of pieces to display, default value is 1
            $ParkingPosition: 360                          //[Optional] The offset position to park thumbnail
        }
    };
    var sliderAlbum = new $JssorSlider$(displayDiv, options);
    //responsive code begin
    //you can remove responsive code if you don't want the slider scales while window resizes
    function ScalePicAlbumSlider() {
        var parentWidth = sliderAlbum.$Elmt.parentNode.clientWidth;
        if (parentWidth)
            sliderAlbum.$ScaleWidth(Math.max(Math.min(parentWidth, 800), 300));
        else
            window.setTimeout(ScalePicAlbumSlider, 30);
    }
    ScalePicAlbumSlider();
    $(window).bind("load", ScalePicAlbumSlider);
    $(window).bind("resize", ScalePicAlbumSlider);
    $(window).bind("orientationchange", ScalePicAlbumSlider);
    //responsive code end
}

function processMenu(gototag) {
    //console.log(gototag);
    if (langSelected.localeCompare('Vietnamese') === 0) {
        menu = menuViet;
        whichSlide = imgSlidePrefix + "viet/";
        dbtable = "CAMELO-MEMBERS";
        headerrow = 0;
        langCal = "vi";
        monthofyear = month_of_year[0];
    }
    if (langSelected.localeCompare('English') === 0) {
        menu = menuEnglish;
        whichSlide = imgSlidePrefix + "english/";
        dbtable = "CAMELO-MEMBERS";
        headerrow = 1;
        langCal = "en";
        monthofyear = month_of_year[1];
    }
    if (langSelected.localeCompare('Spanish') === 0) {
        menu = menuSpanish;
        whichSlide = imgSlidePrefix + "spanish/";
        dbtable = "CAMELO-MEMBERS";
        headerrow = 2;
        langCal = "es";
        monthofyear = month_of_year[2];
    }
    var divStr = '<div id="main">';
    var idx = getMenuGotoIndex(gototag);
    if (gototag.localeCompare('main') === 0) { //thanhgia
        divStr += menu[0].html;
        divStr += '</div>';
        $("#main").replaceWith(divStr);
    } else if (gototag.localeCompare("bando") === 0) {
        divStr += getMenuString(idx);
        divStr += '</ul><br><br><br>';
        divStr += menu[idx].html + '</div>';
        $("#main").replaceWith(divStr);

        var editStr = '<div id="pano" style="clear:both;width:800px; height:500px;"><img style="width:800px; height:500px;" src="http://i1322.photobucket.com/albums/u579/rong4ever/Photobucket%20Desktop%20-%20NSWCDD-D0065DC2/Misc/Google-Maps_zps67189c6f.jpg"></div>';
        $("#pano").replaceWith(editStr);
        editStr = '<div id="mappanel"><img style="width:800px; height:500px;" src="http://i1322.photobucket.com/albums/u579/rong4ever/Photobucket%20Desktop%20-%20NSWCDD-D0065DC2/Misc/Google-Maps_zps67189c6f.jpg"></div>';
        $("#mappanel").replaceWith(editStr);
        google.maps.event.addDomListener(window, 'load', initialize);
        document.getElementById("find").click();
        document.getElementById("autofind").click();
        usermode = 'find';
        codeAddress('Missouri City, TX, United States', "mapfind", usermode);
    } else if ((gototag.localeCompare("linhhon") === 0) || (gototag.localeCompare("caulinhhon") === 0)) {
        divStr += getMenuString(idx);
        if (gototag.localeCompare("caulinhhon") === 0) {
            divStr += '</ul><br><br><br><div class="mapContent">' + menu[idx].html + '<div id="album"></div></div></div>';
            $("#main").replaceWith(divStr);
            CreatePhotoAlbum("caulinhhon", imgPrefix, cauLinhHon[0].img.length);
        } else {
            divStr += '</ul><br><br><br><div id="album"></div></div>';
            $("#main").replaceWith(divStr);
            CreatePhotoAlbum("linhhon", whichSlide, 20);
        }
    } else if ((gototag.localeCompare("thiennguc") === 0) | (gototag.localeCompare("clhvideo") === 0)) {
        divStr += getMenuString(idx);
        divStr += '</ul><br><br><br><div class="email">' + menu[idx].html + '<br><iframe src="' + youTubeEmbedPrefix + cauLinhHon[0].vid[0] + '" width="800" height="600" frameborder="0" allowfullscreen></iframe>\
<br><br><img class="centerIcon" src="http://ducme-camelo.rhcloud.com/img/faqPIC.jpg"></div></div>';
        $("#main").replaceWith(divStr);

    } else if (gototag.localeCompare("luyennguc") === 0) {
        divStr += getMenuString(idx);
        divStr += '</ul><br><br><br><div class="email">' + menu[idx].html + '<br><iframe src="' + youTubeEmbedPrefix + cauLinhHon[0].vid[1] + '" width="800" height="600" frameborder="0" allowfullscreen></iframe>\
<br><br><img class="centerIcon" src="http://ducme-camelo.rhcloud.com/img/faqPIC.jpg"></div></div>';
        $("#main").replaceWith(divStr);
    } else if (gototag.localeCompare("lich") === 0) {
        divStr += getMenuString(idx);
        divStr += '</ul><br><br><br>';
        divStr += menu[idx].html + '</div>';
        $("#main").replaceWith(divStr);
        Calendar = new Date();
        //var curyear = Calendar.getFullYear();     // Returns year
        var curmonth = Calendar.getMonth();    // Returns month (0-11)
        //var today = Calendar.getDate();    // Returns day (1-31)
        var divstr = '<select id="monthBox" class="monthbox" onChange="changeMonthYearData();">';
        for (var x = 0; x < monthofyear.length; x++) {
            divstr += '<option value="' + monthofyear[x] + '"' + (x !== curmonth ? '' : ' selected="selected"') + '>' + monthofyear[x] + '</option>';
        }
        divstr += '</select>';
        initFullcal(langCal);
        document.getElementById("monthBox").innerHTML = divstr;

    } else if (gototag.localeCompare("danhba") === 0) {
        divStr += getMenuString(idx);
        divStr += '</ul><br><br><br><div class="email">';
        divStr += menu[idx].html + '</div>';
        $("#main").replaceWith(divStr);
        accessMemberDatabase("processMenu", '0');
    } else if (gototag.localeCompare("nhac") === 0) {
        divStr += getMenuString(idx);
        setBookArray(menu[idx].html); // get array of 4025 chunks back
        divStr += '</ul><br><br>' + menu[idx].html + '</div>';
        $("#main").replaceWith(divStr);
        CreateTagAlbumDiv('musicavatar', 'musictagalbum');
        PHPSetAlbum('nhac', '6', 'loc=http://ducme-camelo.rhcloud.com/mp3/HuongDangMe.xml&code=0&tagName1=title&tagName2=location', 'http://ducme-camelo.rhcloud.com/mp3/TNCD409-front.jpg');
    } else if (gototag.localeCompare("radio") === 0) {
        divStr += getMenuString(idx);
        setBookArray(menu[idx].html); // get array of 4025 chunks back
        divStr += '</ul><br><br>' + menu[idx].html + '</div>';
        $("#main").replaceWith(divStr);
        CreateTagAlbumDiv('musicavatar', 'musictagalbum');
        PHPSetAlbum('radio', '4', 'type=parse&prefix=http://mehangcuugiup.net/modules/mod_nmap/audio/nmapl.php?s&url1=http://mehangcuugiup.net/index.php/radio?view&url2=featured&code=0&tag=param&attr=value&val=uid&q=//music/group/song&q1=file&q2=title', 'http://mehangcuugiup.net/images/resized/images/sampledata/slideshow/02mofph_960_400_960_400.jpg');
    } else {
        divStr += getMenuString(idx);
        if (findReadingPage(gototag) === true) { // if multiple pages with text only
            setBookArray(menu[idx].html); // get array of 4025 chunks back
            divStr += '</ul><br><br><br><div id="bookContent" class="readingContent2"><div>' + book[0] + '</div><div id="bookpaging" class="paging"></div></div></div>';
            $("#main").replaceWith(divStr);
            repaintReadingPage(curPage);
        } else if (findNonScrollPage(gototag) === true) {
            divStr += '</ul><br><br><br><div id="bookContent" class="email">' + menu[idx].html + '</div></div>';
            $("#main").replaceWith(divStr);
        } else {
            divStr += '</ul><br><br><br><div id="bookContent" class="readingContent">' + menu[idx].html + '</div></div>';
            $("#main").replaceWith(divStr);
        }
    }
}

function findNonScrollPage(gototag) { // set identified section as non scrolled pages with text only, add in more section as needed
    var which = ["tgdiungot", "tganhsao", "tglichsu", "thiennguc", "luyennguc", "clhvideo", "tudao", "caunguyen", "cnvideo", "lich", "danhba", "lienhe2", "dockinh", "nhac", "radio"];
    var ret = $.inArray(gototag, which) > -1; // return index found, -1 means not found
    return ret; // as true or false
}

ko.bindingHandlers.valueWithInit = {
    init: function (element, valueAccessor, allBindingsAccessor, data, context) {
        var bindings = valueAccessor();
        Object.keys(bindings).forEach(function (key) {
            var observable = bindings[key],
                    binding = {};
            switch (key) {
                case 'value':
                    initialValue = element.value;
                    break;
                case 'text':
                    initialValue = $(element).text();
            }
            if (!ko.isWriteableObservable(data[observable])) {
                data[observable] = ko.observable();
            }
            data[observable](initialValue);

            binding[key] = data[observable];
            ko.applyBindingsToNode(element, binding, context);
        });
    }
};

function getMenuString(idx) {
    var divStr = '<ul id="menu">';
    for (var i = 0; i < menu[idx].params.length; i++) {
        divStr += '<li><a onclick="processMenu(' + "'" + menu[idx].gotoTag[i] + "'" + ');">' + menu[idx].params[i] + '</a></li>';
    }
    return divStr;
}

function AppViewModel() {
    var self = this;
    self.title = ko.observable("title");
    self.selection = ko.observable("selection");
    self.greeting = ko.observable("greeting");
    self.welcome1 = ko.observable("welcome1");
    self.welcome2 = ko.observable("welcome2");
    self.welcome3 = ko.observable("welcome3");
    self.closing = ko.observable("closing");
    self.signature = ko.observable("signature");
    self.email = ko.observable("email");
    self.disclaim = ko.observable("disclaim");
    self.Language = ko.observable("Vietnamese");
    self.Language.subscribe(function (lang) {
        if (lang === "English") {
            setEnv('view', 'CAMELO-MEMBERS', 'none');
            document.getElementById("Enter").value = "Enter Site";
            document.title = "LADY OF MT CARMEL";
            langSelected = "English";
            self.title("LADY OF MT CARMEL");
            self.selection("Please click on the option box below to select your viewing language (Default Vietnamese)");
            self.greeting("Welcome to the Site of Our Lady of Mount Carmel,");
            self.welcome1("Welcome to our site. We invite you to look around and get a feel for our site. Feel free to \
                    share any comments or questions that might be on your mind through our online guest book. If you're not currently \
                    a member of our group. We'd like to take this opportunity to invite you to one of our weekly services. And of \
                    course, feel free to reach out and call one of our Pastors or Ministry Leaders.");
            self.welcome2("We hope you and your family will have a warm and spirit-filled experience with us as we worship and \
                    fellowship together at our services, events, and ministries.");
            self.welcome3("We'd also like to invite you to make an online prayer request. You're prayer request opens the door, \
                    and God is waiting patiently on the other side of that door, at all times, in all situations, to join with you.");
            self.closing("Many blessings to you,");
            self.signature("Quang Nguyen, Tuyen Le and Thanh Nguyen");
            self.email("Email: songdepmecamelo@gmail.com");
            self.disclaim("Disclaim: (Needs Quang's English statement here)");
        }
        if (lang === "Spanish") {
            setEnv('view', 'CAMELO-MEMBERS', 'none');
            document.getElementById("Enter").value = "Introduzca Sitio";
            document.title = "VIRGO MARY DE MT CARMELO";
            langSelected = "Spanish";
            self.title("VIRGO MARY DE MT CARMELO");
            self.selection("Please click on the option box below to select your viewing language (Default Vietnamese)");
            //self.selection("Por favor, haga clic en el cuadro de opciones de abajo para seleccionar el idioma de visualización (por defecto Inglés)");
            self.greeting("Bienvenido al sitio de nuestra Señora del Monte Carmelo,");
            self.welcome1("Bienvenido a nuestro sitio. Le invitamos a mirar alrededor y tener una idea de nuestro sitio. \
                    Siéntase libre de compartir cualquier comentario o pregunta que pueda estar en su mente a través de nuestro libro de visitas \
                    en línea. Si usted no es actualmente miembro de nuestro grupo. Nos gustaría aprovechar esta oportunidad para invitarle a uno de nuestros \
                    servicios semanales. Y, por supuesto, no dude en acercarse y llamar a uno de nuestros pastores o líderes del ministerio.");
            self.welcome2("Esperamos que usted y su familia tendrán una experiencia cálida y llena de espíritu con nosotros como \
                    nosotros adoramos y compañerismo juntos en nuestros servicios, eventos y ministerios.");
            self.welcome3("También nos gustaría invitarle a hacer una petición de oración en línea. Su petición de oración abre \
                    la puerta, y Dios está esperando pacientemente en el otro lado de esa puerta, en todo momento, en todas las situaciones, \
                    a unirse con usted.");
            self.closing("Muchas bendiciones a usted,");
            self.signature("Familia de Quang, Tuyen and My Thanh Nguyen");
            self.email("Email: songdepmecamelo@gmail.com");
            self.disclaim("Descargo de responsabilidad: (Needs Quang's Spanish statement here)");
        }
        if (lang === "Vietnamese") {
            setEnv('view', 'CAMELO-MEMBERS', 'none');
            document.getElementById("Enter").value = "Nhập Site";
            document.title = "ĐỨC MẸ CA MÊ LÔ";
            langSelected = "Vietnamese";
            self.title("ĐỨC MẸ CA MÊ LÔ");
            self.selection("Please click on the option box below to select your viewing language (Default Vietnamese)");
            //self.selection("Xin vui lòng bấm vào tùy chọn hộp dưới đây để chọn ngôn ngữ của bạn (Mặc định tiếng Việt)");
            self.greeting("Kính chào quí khán giả,");
            self.welcome1("Xin chào mừng đến trang web của chúng tôi đễ nghe tin mừng phước lành của Mẹ Maria Núi Ca mê lô và Ơn Cứu Độ \
                           của con Mẹ. Mời bạn vào truy cập tìm hiễu và chúc quí bạn và gia đình luôn được nhiều hồng ân của Mẹ Maria \
                           luôn mãi và được nhiều an ũi trong những ngày phút cuối của cuộc sống. Chúng tôi mời các bạn nhìn xung quanh \
                           và nhận được một cảm giác về trang web của chúng tôi. Hãy chia sẻ bất kỳ ý kiến hoặc câu hỏi có thể có trong \
                           tâm trí của bạn thông qua cuốn sách khách trực tuyến của chúng tôi. Nếu bạn hiện chưa phải là thành viên của \
                           nhóm của chúng tôi. Chúng tôi muốn nhân cơ hội này để mời bạn đến một trong những dịch vụ hàng tuần của chúng \
                           tôi. Và tất nhiên, cảm thấy tự do để tiếp cận và gọi một trong những mục tử hoặc Bộ Leaders của chúng tôi.");
            self.welcome2("Chúng tôi hy vọng bạn và gia đình bạn sẽ có một trải nghiệm ấm áp và tinh thần đầy với chúng \
                    tôi khi chúng ta thờ phượng và mối tương giao với nhau tại các dịch vụ, các sự kiện của chúng tôi, và các bộ.");
            self.welcome3("Chúng tôi cũng muốn mời bạn thực hiện một yêu cầu cầu nguyện trực tuyến. Yêu cầu cầu nguyện của \
                    bạn sẽ mở cửa, và Đức Chúa Trời đang kiên nhẫn chờ đợi ở phía bên kia cánh cửa đó, mọi lúc, trong mọi tình \
                    huống, để tham gia với bạn.");
            self.closing("Nhiều phước lành cho bạn,");
            self.signature("Gia Đình Quang, Tuyền & Mỹ Thanh Nguyễn");
            self.email("Email: songdepmecamelo@gmail.com");
            self.disclaim("Tuyên Bố Không Nhận: (Needs Quang's Viet statement here)");
        }
    });
    self.Languagelist = ['Vietnamese', 'English', 'Spanish'];
    return self;
}

function tableHeaderClicked() {
    //grab all header rows
    $('th').each(function (column) {
        $(this).addClass('sortable').click(function () {
            var findSortKey = function ($cell) {
                return $cell.find('.sort-key').text().toUpperCase() + ' ' + $cell.text().toUpperCase();

            };
            var sortDirection = $(this).is('.sorted-asc') ? -1 : 1;
            var $rows = $(this).parent().parent().parent().find('tbody tr').get();
            var bob = 0;
            //loop through all the rows and find
            $.each($rows, function (index, row) {
                row.sortKey = findSortKey($(row).children('td').eq(column));
            });

            //compare and sort the rows alphabetically or numerically
            $rows.sort(function (a, b) {
                if (a.sortKey.indexOf('-') == -1 && (!isNaN(a.sortKey) && !isNaN(a.sortKey))) {
                    //Rough Numeracy check                          

                    if (parseInt(a.sortKey) < parseInt(b.sortKey)) {
                        return -sortDirection;
                    }
                    if (parseInt(a.sortKey) > parseInt(b.sortKey)) {
                        return sortDirection;
                    }

                } else {
                    if (a.sortKey < b.sortKey) {
                        return -sortDirection;
                    }
                    if (a.sortKey > b.sortKey) {
                        return sortDirection;
                    }
                }
                return 0;
            });

            //add the rows in the correct order to the bottom of the table
            $.each($rows, function (index, row) {
                $('tbody').append(row);
                row.sortKey = null;
            });

            //identify the collumn sort order
            $('th').removeClass('sorted-asc sorted-desc');
            var $sortHead = $('th').filter(':nth-child(' + (column + 1) + ')');
            sortDirection == 1 ? $sortHead.addClass('sorted-asc') : $sortHead.addClass('sorted-desc');

            //identify the collum to be sorted by
            $('td').removeClass('sorted').filter(':nth-child(' + (column + 1) + ')').addClass('sorted');
        });
    });
}

// MAP
function InitMap() {
    var editStr = '<div id="pano" style="clear:both;width:800px; height:500px;"><img style="width:800px; height:500px;" src="http://i1322.photobucket.com/albums/u579/rong4ever/Photobucket%20Desktop%20-%20NSWCDD-D0065DC2/Misc/Google-Maps_zps67189c6f.jpg"></div>';
    $("#pano").replaceWith(editStr);
    editStr = '<div id="mappanel"><img style="width:800px; height:500px;" src="http://i1322.photobucket.com/albums/u579/rong4ever/Photobucket%20Desktop%20-%20NSWCDD-D0065DC2/Misc/Google-Maps_zps67189c6f.jpg"></div>';
    $("#mappanel").replaceWith(editStr);
    google.maps.event.addDomListener(window, 'load', initialize);
}

function initialize() {
    map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    map.setCenter(intLoc);
    panoramaOptions = {
        position: intLoc,
        pov: {
            heading: 34,
            pitch: 10
        }
    };
    var input = document.getElementById('mapfind');
    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        clearAllmarkers();
        codeAddress(getAddress(autocomplete), "mapfind", usermode);
    });
}

function getAddress(auto) {
    var address = "";
    // Get the place details from the autocomplete object.
    var place = auto.getPlace();
    // Get each component of the address from the place details
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            if (i === place.address_components.length - 1) {
                address += place.address_components[i][componentForm[addressType]];
            } else {
                address += place.address_components[i][componentForm[addressType]] + ",";
            }
        }
    }
    return address;
}

function codeAddress(loc, id, action) {
    var input = document.getElementById(id).value;
    //var temp1 = loc.replace(/'/g, '\'');
    var addr = input.split(',');
    var addr1 = loc.split(',');
    console.log("loc " + loc);
    geocoder.geocode({'address': loc}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            newLoc = results[0].geometry.location;
            map.setZoom(13);
            map.panTo(newLoc);
            map.setCenter(newLoc);
            var marker = new google.maps.Marker({
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.HYBRID,
                map: map,
                position: newLoc,
                animation: google.maps.Animation.BOUNCE
            });
            markers.push(marker);
            //console.log("addr[0] " + addr[0]);
            var cont = "";
            if (action.localeCompare("manual") === 0)
                cont = "<b>" + addr[0] + "</b><br/>" + addr1[1] + "<br/>" + addr1[2];
            else
                cont = "<b>" + addr[0] + "</b><br/>" + addr1[0] + " " + addr1[1] + "<br/>" + addr1[2] + " " + addr1[3] + " " + addr1[5] + "<br/>" + addr1[4];
            var infowindow = new google.maps.InfoWindow({content: cont, maxWidth: 400});
            google.maps.event.addListener(marker, "click", function () {
                infowindow.open(map, marker);
            });
            infowindow.open(map, marker);
            panoramaOptions = {
                position: newLoc,
                pov: {
                    heading: 34,
                    pitch: 10
                }
            };
            panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
            map.setStreetView(panorama);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function calcRoute(start, end) {

    var panelStr = '<div id="mappanel"><div class="map" id="map-canvas"></div><div class="direction" id="directions-panel"></div></div>';
    $("#mappanel").replaceWith(panelStr);
    map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
    codeAddress(end, 'mapEnd', usermode);
    codeAddress(start, 'mapStart', usermode);
}

function clearAllmarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function findAddress() {
    clearAllmarkers();
    codeAddress(document.getElementById("mapfind").value, "mapfind", usermode);
}

function getDirection() {
    clearAllmarkers();
    var editStr = '<div id="pano" style="clear:both;width:800px; height:500px;"></div>';
    $("#pano").replaceWith(editStr);
    if (usermode.localeCompare("manual") === 0)
        calcRoute(document.getElementById("mapStart").value, document.getElementById("mapEnd").value);
    else
        calcRoute(startAddr, endAddr);
}

function createHomeBtn() {
    // Create a DIV to hold the control and call HomeControl()
    var homeControlDiv = document.createElement('div');
    var homeControl = new HomeControl(homeControlDiv, map);
//  homeControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
}

// Add a Home control that returns the user to London
function HomeControl(controlDiv, map) {
    controlDiv.style.padding = '5px';
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'yellow';
    controlUI.style.border = '1px solid';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Set map to Missouri City, TX';
    controlDiv.appendChild(controlUI);
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.innerHTML = '<b>Home<b>'
    controlUI.appendChild(controlText);

    // Setup click-event listener: simply set the map to London
    google.maps.event.addDomListener(controlUI, 'click', function () {
        map.setCenter(intLoc);
        map.setZoom(15);
        clearAllmarkers();
        usermode = 'find';
        codeAddress('Missouri City, TX, United States', "mapfind", usermode);
    });
}

function handleClick(which, myRadio) {
    var editStr = "";
    if (which.localeCompare("map") === 0) {
        var editStr = "";
        clearAllmarkers();
        if (myRadio.value == 1) { // find
            action = "find";
            editStr = '<div id="pano" style="clear:both;width:800px; height:500px;"><img style="width:800px; height:500px;" src="http://i1322.photobucket.com/albums/u579/rong4ever/Photobucket%20Desktop%20-%20NSWCDD-D0065DC2/Misc/Google-Maps_zps67189c6f.jpg"></div>';
            $("#pano").replaceWith(editStr);
            editStr = '<div id="mapinput" style="clear:both;">'
                    + '<span style="color:black;">Find:&nbsp;&nbsp;</span>';
            if (usermode.localeCompare("auto") === 0) {
                editStr += '<input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapfind" type="text" value=""></div>';
                $("#mapinput").replaceWith(editStr);
                var auto = new google.maps.places.Autocomplete(document.getElementById("mapfind"));
                google.maps.event.addListener(auto, 'place_changed', function () {
                    codeAddress(getAddress(auto), "mapfind", usermode);
                });
            }
            if (usermode.localeCompare("manual") === 0) {
                editStr += '<input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapfind" type="text" value="Required Format -> title,123 Victor Dr,Charlotte NC"><br><br><button onclick="findAddress()">Goto</button></div>';
                $("#mapinput").replaceWith(editStr);
            }
            var panelStr = '<div id="mappanel"><div id="map-canvas" style="width:800px; height:500px;background:#1B1D1A;"></div></div>';
            $("#mappanel").replaceWith(panelStr);
            map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
            createHomeBtn();
        }
        else if (myRadio.value == 2) { // get direction
            action = "direction";
            editStr = '<div id="pano" style="clear:both;width:800px; height:500px;"><img style="width:800px; height:500px;" src="http://i1322.photobucket.com/albums/u579/rong4ever/Photobucket%20Desktop%20-%20NSWCDD-D0065DC2/Misc/Google-Maps_zps67189c6f.jpg"></div>';
            $("#pano").replaceWith(editStr);
            editStr = '<div id="mapinput" style="clear:both;">';
            $("#mapinput").replaceWith(editStr);
            if (usermode.localeCompare("auto") === 0) {
                editStr += '<span style="color:black;">Start:&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapStart" type="text" value="">'
                        + '<br>'
                        + '<span style="color:black;"> End:&nbsp;&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapEnd" type="text" value="">'
                        + '<br><br><button onclick="getDirection()">Get Direction</button></div>';
                $("#mapinput").replaceWith(editStr);
                var auto1 = new google.maps.places.Autocomplete(document.getElementById("mapStart"));
                google.maps.event.addListener(auto1, 'place_changed', function () {
                    startAddr = getAddress(auto1);
                });
                var auto2 = new google.maps.places.Autocomplete(document.getElementById("mapEnd"));
                google.maps.event.addListener(auto2, 'place_changed', function () {
                    endAddr = getAddress(auto2);
                });
            }
            if (usermode.localeCompare("manual") === 0) {
                editStr += '<span style="color:black;">Start:&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapStart" type="text" value="Required Format -> Joe\'s house,123 Victor Dr,Charlotte NC">'
                        + '<br>'
                        + '<span style="color:black;"> End:&nbsp;&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapEnd" type="text" value="Required Format -> Mary\'s house,321 Panel St,Richmond NY">'
                        + '<br><br><button onclick="getDirection()">Get Direction</button></div>';
                $("#mapinput").replaceWith(editStr);
            }
            var panelStr = '<div id="mappanel"><div id="map-canvas" style="width:800px; height:500px;background:#1B1D1A;"></div></div>';
            $("#mappanel").replaceWith(panelStr);
            map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
            createHomeBtn();
        }
        else if (myRadio.value == 3) { // auto complete
            usermode = "auto";
            editStr = '<div id="mapinput" style="clear:both;">';
            if (action.localeCompare("find") === 0) {
                editStr += '<span style="color:black;">Location:&nbsp;&nbsp;</span> <input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapfind" type="text" value=""></div>';
                $("#mapinput").replaceWith(editStr);
                var ac1 = new google.maps.places.Autocomplete(document.getElementById('mapfind'));
                google.maps.event.addListener(ac1, 'place_changed', function () {
                    codeAddress(getAddress(ac1), "mapfind", usermode);
                });
            }
            if (action.localeCompare("direction") === 0) {
                editStr += '<span style="color:black;">Start:&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapStart" type="text" value="">'
                        + '<br>'
                        + '<span style="color:black;">End:&nbsp;&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapEnd" type="text" value="">'
                        + '<br><br><button onclick="getDirection()">Get Direction</button></div>';
                $("#mapinput").replaceWith(editStr);
                var ac2 = new google.maps.places.Autocomplete(document.getElementById("mapStart"));
                google.maps.event.addListener(ac2, 'place_changed', function () {
                    startAddr = getAddress(ac2);
                });
                var ac3 = new google.maps.places.Autocomplete(document.getElementById("mapEnd"));
                google.maps.event.addListener(ac3, 'place_changed', function () {
                    endAddr = getAddress(ac3);
                });
            }
        }
        else if (myRadio.value == 4) { // manual input
            usermode = "manual";
            editStr = '<div id="mapinput" style="clear:both;">';
            if (action.localeCompare("find") === 0) {
                editStr += '<span style="color:black;">Location:</span> <input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapfind" type="text" value="Required Format -> title,123 Victor Dr,Charlotte NC">'
                        + '<br><br><button onclick="findAddress()">Goto</button></div>';
                $("#mapinput").replaceWith(editStr);
            }
            if (action.localeCompare("direction") === 0) {
                editStr += '<span style="color:black;">Start:&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapStart" type="text" value="Required Format -> Joe\'s house,123 Victor Dr,Charlotte NC">'
                        + '<br>'
                        + '<span style="color:black;"> End:&nbsp;&nbsp;</span><input style="color:black; background-color:lightgray;" size="115" spellcheck="false" id="mapEnd" type="text" value="Required Format -> Mary\'s house,321 Panel St,Richmond NY">'
                        + '<br><br><button onclick="getDirection()">Get Direction</button></div>';
                $("#mapinput").replaceWith(editStr);
            }
        }
    }
}

function Log(msg) {
    console.log(msg);
}


function Check(x) {
    if (x.localeCompare('login') === 0)
        x = document.getElementById("myPsw").value;
    var divStr = '<div id="psswdVidMsg">';
    setTimeout(function () { // delay
        $.post("https://ducme-camelo.rhcloud.com/index.php", {"CHKMATMA": "matma=" + x + "&loc=ducme-camelo"}, function (data) { // sending ajax post request
            var temp = JSON.stringify(data);
            var result = JSON.parse(temp);
            if (result.localeCompare("BAD") !== 0) {
                //divStr += '<iframe src="' + dbManagerDivStr + '" width="100%" height="2000"/></iframe>';
                divStr += dbManagerDivStr + '</div>';
                $("#chkVidPswd").replaceWith(divStr);
                setEnv('manage', 'CAMELO-MEMBERS', 'Members DBase Manager');
            } else {
                divStr += '<p>No Cigar. Try Again.</p></div>';
                divStr += '</div>';
                $("#psswdVidMsg").replaceWith(divStr);
                setTimeout(function () { // delay              
                    $("#psswdVidMsg").replaceWith('<div id="psswdVidMsg"></div>');
                }, 2000);
            }
        });
    }, 50);
}

function setUpBook(array) {
    book = array;
    //console.log(book.length);
    if (book.length > 1)
        repaintReadingPage(curPage);
}

function processPrevPage() {
    //  var li = document.getElementById("current");
    //  console.log(li.textContent || li.innerText);
    //  Example html, set style a.hover { cursor: pointer;} the hand
    //            <div id="page"><ul class="tsc_pagination tsc_paginationA tsc_paginationA09">   using local ./css/Paging.css;
    //                      <li><a class="first">First</a></li>
    //                      <li><a class="previous">Previous</a></li>
    //                      <li><a href="#">1</a></li>
    //                      <li><a href="#">2</a></li>
    //                      <li><a class="current">3</a></li>
    //                      <li><a href="#">4</a></li>
    //                      <li><a href="#">5</a></li>
    //                      <li><a class="next">Next</a></li>
    //                      <li><a class="last">Last</a></li>
    //                </ul>
    //            </div>
    if ((curPage - 1) < 0)
        curPage = 0;
    else
        curPage = curPage - 1;
    repaintReadingPage(curPage);
}
function processNextPage() {
    // var li = document.getElementById("current")
    // console.log(li.textContent || li.innerText);
    if ((curPage + 1) === (book.length))
        curPage = book.length - 1;
    else {
        curPage = curPage + 1;
    }
    console.log(curPage);
    repaintReadingPage(curPage);
}

function repaintReadingPage() {
    var divStr = '<div id="bookContent" class="readingContent2"><div>' + book[curPage];
    var str = divStr + '<div id="bookpaging" class="paging"><ul class="tsc_pagination tsc_paginationA tsc_paginationA09">';
    var current = '<li class="current"><a>' + '  Page ' + (curPage + 1) + " of " + book.length + ' </a></li>';
    str += '<li><a onclick="processPrevPage()" class="prevnext">Previous</a>'
            + current + '<li><a onclick="processNextPage()" class="prevnext">Next</a></li></ul>';
    str += '</div></div>';
    $("#bookContent").replaceWith(str);
}

function setBookArray(str) {
    book = str.match(/.{1,4020}/g); // get array of 4020 char chunks back
}

function findReadingPage(gototag) {
    var which = ["rgleducme"]; // set identified section as multiple pages with text only, add in more section as needed
    var ret = $.inArray(gototag, which) > -1; // return index found, -1 means not found
    return ret; // as true or false
}

function Check(x) {
    //if (x.localeCompare('login') === 0)
    //    x = document.getElementById("myPsw").value;
    //var divStr = '<div id="psswdVidMsg">';
    setTimeout(function () { // delay
        $.post("https://ducme-camelo.rhcloud.com/index.php", {"CHKMATMA": "matma=" + x + "&loc=ducme-camelo"}, function (data) { // sending ajax post request
            // var temp = JSON.stringify(data);
            // var result = JSON.parse(temp);
            // if (result.localeCompare("BAD") !== 0) {
            //divStr += '<iframe src="' + dbManagerDivStr + '" width="100%" height="2000"/></iframe>';
            //     divStr += dbManagerDivStr + '</div>';
            //     $("#chkVidPswd").replaceWith(divStr);
            //     setEnv('manage', 'CAMELO-MEMBERS', 'Members DBase Manager');
            // } else {
            //     divStr += '<p>No Cigar. Try Again.</p></div>';
            //     divStr += '</div>';
            //     $("#psswdVidMsg").replaceWith(divStr);
            //     setTimeout(function () { // delay              
            //         $("#psswdVidMsg").replaceWith('<div id="psswdVidMsg"></div>');
            //     }, 2000);
            // }
        });
    }, 50);
}