export const STORY = {
	intro: [
		"Kız kardeşim Zeynep üç gündür uyumuyor.",
		"Ateşi her gece biraz daha düşüyor. Köyün hekimi çoktan umudunu kesti.",
		"Yaşlılar kuyuyu fısıldar: “Dileğini söyle, bedelini o seçer.”",
		"İpi belime doladım. Aşağıda bir şey beni bekliyor.",
		"Ve o şey, Zeynep’in sesiyle konuşuyor.",
	],
	rooms: [
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
			title: "II. BOĞULMUŞ ŞAPEL",
			subtitle: "Suyun altında hâlâ dua eden bir rahip var.",
			objective: "Duvardaki renkleri sırayla bas. Kapı açılsın.",
			enter: [
				"Şapelin zemini diz boyu su. Ama su kımıldamıyor.",
				"Duvarda üç işaret var: KIRMIZI, MAVİ, KIRMIZI.",
			],
		},
		{
			title: "III. KEMİK PAZARI",
			subtitle: "Burada her şeyin bir fiyatı var.",
			objective: "Sandığı mavi taşa it. Kapıyı aç.",
			enter: [
				"Tezgâhlar boş. Ama paranın sesi hâlâ duyuluyor.",
				"Tüccar gülümsüyor. Elleri yok.",
			],
		},
		{
			title: "IV. KIRIK KÖPRÜ",
			subtitle: "Kuyu, sabırsızları sevmez.",
			objective: "Taşa bas, kapıyı aç ve köprüyü geç.",
			enter: [
				"Köprü, kemiklerden örülmüş gibi. Altında hiçbir şey yok.",
				"Uzakta bir çan sesi. Kapı yalnızca birkaç nefes açık kalır.",
			],
		},
		{
			title: "V. SESSİZ ATEŞ",
			subtitle: "Kuyu, ışığı senden alır; karşılığında yol verir.",
			objective: "Üç ocağı korla yak. Kapı açılsın.",
			enter: [
				"Üç taş ocak var. Hiçbiri yanmıyor.",
				"Fenerin yağı azalıyor. Kor, karanlığı bir an için yarar.",
			],
		},
		{
			title: "VI. DİP",
			subtitle: "Kuyunun kalbi. Ve kardeşimin sesi.",
			objective: "Bekçiyi yen. Sonra seç.",
			enter: [
				"Burada su yok. Sadece nefes ve tik-tak.",
				"Karanlığın ortasında bir şey, Zeynep’in yüzüyle başını kaldırıyor.",
			],
		},
	],
	memories: [
		"Bir hatıra: Kuyuya ilk inen şövalye, kardeşini geri getirmek için kendi adını verdi.",
		"Bir hatıra: Tüccar, sattığı her şeyin kuyuda bir yankısı olduğunu fark ettiğinde çok geçti.",
		"Bir hatıra: Rahip, kuyunun sesini duyduğu gün imanını değil, kızının adını kaybetti.",
	],
	dialogues: {
		priest: [
			"Rahip: “Ben de bir dilek tuttum. Şimdi suyun altında dua ediyorum.”",
			"Rahip: “Kuyu istediğini verir. Ama önce neyi kaybettiğini sorar.”",
			"Rahip: “Renkleri hatırla. Kırmızı başlar, mavi nefes alır, kırmızı bitirir.”",
		],
		merchant: [
			"Tüccar: “Altın istedim. Kuyu bana altın verdi. Sonra ellerimi aldı.”",
			"Tüccar: “Dibinde bir bekçi var. Seni tanıyor. Kardeşinin yüzüyle bakıyor.”",
			"Tüccar: “Sandığı mavi taşa sürükle. Kapı açılır. Ama acele et.”",
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
