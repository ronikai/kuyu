export const STORY = {
	intro: [
		"Kız kardeşim Zeynep üç gündür uyumuyor.",
		"Ateşi her gece biraz daha düşüyor. Köyün hekimi çoktan umudunu kesti.",
		"Bu gece kapımızı yaşlı bir amca çaldı.",
		"Kuyudan bahsetti. Dileklerden. Ve bedellerden.",
		"Sonra gitti. Kapı hâlâ açık.",
	],
	rooms: [
		{
			title: "EV",
			subtitle: "Zeynep'in odası. Ateş, yağmur, bir kapı.",
			objective: "Yaşlı amcayı dinle.",
			enter: [
				"Zeynep üç gündür aynı yatakta. Nefesi cam gibi.",
				"Kapı vuruldu. Yaşlı amca içeri girdi.",
			],
		},
		{
			title: "KASABA MEYDANI",
			subtitle: "Kuyu, kasabanın ortasında bir ağız gibi açık.",
			objective: "Kuyuya yaklaş ve E ile in.",
			enter: [
				"Meydan boş. Herkes perdelerin arkasından bakıyor.",
				"Yaşlı amcanın sözleri hâlâ kulağında: “Bedelini o seçer.”",
			],
		},
		{
			title: "I. KUYU BAŞI",
			subtitle: "İlk kat. Duvarlar nefes alıyor.",
			objective: "Aşağıdaki merdiveni bul.",
			enter: [
				"Kuyunun ağzı yukarıda küçük bir yara gibi kapandı.",
				"Fenerin ışığı taşları yalıyor. Uzakta bir şey sürünüyor.",
			],
		},
		{
			title: "II. AYRIM",
			subtitle: "Kuyu iki kapı açtı. İkisi de aynı yere iniyor.",
			objective: "Bir yol seç: sol Kemik Bahçesi, sağ Sessiz Kütüphane.",
			enter: [
				"Soldan kemik kokusu geliyor. Sağdan kâğıt hışırtısı.",
				"Kuyu fısıldıyor: “Seç. Ama seçtiğini unutma.”",
			],
		},
		{
			title: "III. KEMİK BAHÇESİ",
			subtitle: "Kemiklerden bir bahçe. Her adımda çatırdıyor.",
			objective: "Tüm bekçileri yen. Mührü al.",
			enter: [
				"Toprak yerine kemik. Ağaç yerine kaburga.",
				"Çıkıştaki mühür, ancak bekçiler düşünce açılır.",
			],
		},
		{
			title: "IV. SESSİZ KÜTÜPHANE",
			subtitle: "Raflar boş. Ama sayfalar hâlâ fısıldıyor.",
			objective: "Kaldıraçları YUKARI - AŞAĞI - YUKARI yap.",
			enter: [
				"Duvarda üç kaldıraç deseni var: YUKARI, AŞAĞI, YUKARI.",
				"Kâğıtların arasından bir çocuk sesi gülüyor.",
			],
		},
		{
			title: "V. BOĞULMUŞ ŞAPEL",
			subtitle: "Suyun altında hâlâ dua eden bir şey var.",
			objective: "Duvardaki 4 rengi sırayla bas: KIRMIZI-MAVİ-KIRMIZI-MAVİ.",
			enter: [
				"Şapelin zemini diz boyu su. Ama su kımıldamıyor.",
				"Duvarda dört işaret var: KIRMIZI, MAVİ, KIRMIZI, MAVİ.",
			],
		},
		{
			title: "VI. KEMİK PAZARI",
			subtitle: "Burada her şeyin bir fiyatı var.",
			objective: "İki sandığı iki mavi taşa it. İkisi de basılı kalsın.",
			enter: [
				"Tezgâhlar boş. Ama paranın sesi hâlâ duyuluyor.",
				"İki sandık, iki taş. Kapı ikisi de basılınca açılır.",
			],
		},
		{
			title: "VII. KIRIK KÖPRÜ",
			subtitle: "Kuyu, sabırsızları sevmez.",
			objective: "Taşa bas, kapıyı aç ve köprüyü geç. Çöken taşlara dikkat et.",
			enter: [
				"Köprü, kemiklerden örülmüş gibi. Altında hiçbir şey yok.",
				"Uzakta bir çan sesi. Kapı yalnızca birkaç nefes açık kalır.",
			],
		},
		{
			title: "VIII. SESSİZ ATEŞ",
			subtitle: "Kuyu, ışığı senden alır; karşılığında yol verir.",
			objective: "Dört ocağı Q ile yak. Dördüncü ateş bekçiyi uyandırır.",
			enter: [
				"Dört taş ocak var. Hiçbiri yanmıyor.",
				"Fenerin yağı azalıyor. Kor, karanlığı bir an için yarar.",
			],
		},
		{
			title: "IX. DİP",
			subtitle: "Kuyunun kalbi. Ve kardeşimin sesi.",
			objective: "Bekçiyi yen. Sonra seç.",
			enter: [
				"Burada su yok. Sadece nefes ve tik-tak.",
				"Karanlığın ortasında bir şey, Zeynep'in yüzüyle başını kaldırıyor.",
			],
		},
	],
	memories: [
		"Bir hatıra: Kuyuya ilk inen şövalye, kardeşini geri getirmek için kendi adını verdi.",
		"Bir hatıra: Tüccar, sattığı her şeyin kuyuda bir yankısı olduğunu fark ettiğinde çok geçti.",
		"Bir hatıra: Rahip, kuyunun sesini duyduğu gün imanını değil, kızının adını kaybetti.",
	],
	dialogues: {
		oldman: [
			"Yaşlı Amca: “Zeynep'in ateşi dinmiyor, değil mi?”",
			"Yaşlı Amca: “Kasabanın ortasındaki kuyu... ona bir dilek söylersen gerçekleştirir.”",
			"Yaşlı Amca: “Ama bedeli vardır. Kuyu senden bir şey alır. Bazen bir eşya, bazen bir hatıra, bazen bir isim.”",
			"Yaşlı Amca: “Ben de yıllar önce bir dilek tuttum. Şimdi kim olduğumu hatırlamıyorum.”",
			"Yaşlı Amca: “Git. Ama ne verdiğini iyi düşün.”",
		],
		well: [
			"Kuyu: “Bir dilek söyle.”",
			"Kerem: “Zeynep'i iyileştir.”",
			"Kuyu: “Bedelini ben seçerim.”",
			"Kuyu: “Aşağı gel.”",
		],
		boss: [
			"Bekçi: “Onu geri getiremem.”",
			"Bekçi: “Ama seni ona götürebilirim.”",
			"Bekçi: “Bir kopya yapabilirim. Nefes alır. Seni sever. Adını bilir.”",
			"Bekçi: “Ama senin hatıralarınla yaşar. Sen unuttukça o eksilir.”",
		],
	},
	endings: {
		copy: {
			title: "SON I — SUDA BİR YÜZ",
			lines: [
				"Kopyayı kucağıma aldım. Hafifti. Nefes alıyordu.",
				"Köye döndüğümde herkes ağladı. Ben ağlayamadım.",
				"Zeynep gülüyordu. Ama gülüşü, hatırladığımdan bir tık kısaydı.",
				"Her gece biraz daha sustu. Her sabah biraz daha bana benzedi.",
				"Ve ben, onu unuttukça onun da beni unuttuğunu fark ettim.",
			],
		},
		break: {
			title: "SON II — SESSİZ SU",
			lines: [
				"Kuyuyu kırdım. Taşlar suya karıştı. Su toprağa.",
				"Zeynep o gece öldü. Köyün kuyusu bir daha dolmadı.",
				"Ama onun adını, sesini, kahkahasını kimse benden alamadı.",
				"Bazen geceleri kuyunun yerine gidip adını fısıldıyorum.",
				"Ve bazen, çok uzaklardan, o da bana fısıldıyor.",
			],
		},
	},
};
