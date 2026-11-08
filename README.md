# KUYU

> Bir dilek. Bir bedel.

2.5D görünümlü, top-down piksel korku-aksiyon-macera oyunu. Kız kardeşini kurtarmak için dilek kuyusuna inen bir karakterin hikâyesi. Kuyu konuşur, hatıraları toplar ve sonunda bir seçim bırakır.

**Motor:** KAPLAY 3001.0.19 (dahili fizik, başka motor/fizik kütüphanesi yok)  
**Çalıştırma:** `npm install` → `npm run dev` → `http://localhost:3001`

## Kontroller

| Tuş | İşlev |
|---|---|
| WASD / Ok tuşları | 8 yönlü hareket |
| J / X | Kılıç saldırısı (kombo) |
| Shift / K | Atılma (kısa i-frame + afterimage) |
| E / Enter | Etkileşim, diyalog ilerletme, sandık açma, sandık itme |
| Q | Kor patlaması (tüccardan alınır; düşmanları sersemletir) |
| Esc | Duraklat / devam et |
| 1 / 2 | Final seçimi |
| R (game over) | Son odadan devam et |
| Enter (game over) | Baştan başla |

## Numaralı mekanik listesi

1. 8 yönlü hareket ve kamera sabit 3/4 top-down görünüm.
2. Kılıç saldırısı; 1.6 saniyelik kombo penceresi ve kombo hasar bonusu.
3. Dash: 0.18 sn atılma, 0.32 sn dokunulmazlık, afterimage efekti, 0.9 sn bekleme.
4. Fener yağı: sürekli azalan ışık kaynağı; yağ azaldıkça vinyet koyulaşır, ışık küçülür.
5. Kor patlaması (Q): çevredeki düşmanlara hasar + 1.5 sn sersemletme; yağ tüketir.
6. Etkileşim sistemi: NPC diyalogları, sandık açma, sandık itme, çıkış.
7. Renk sırası bulmacası: KIRMIZI → MAVİ → KIRMIZI plakalara sırayla bas; yanlış sıra sıfırlar.
8. Sandık/sokoban bulmacası: sandığı mavi baskı taşına it; kapı açılır.
9. Zamanlı kapı parkuru: taşa bas, 5 saniyelik kapı açılırken dikenli köprüyü geç.
10. Diken tuzakları: aktif/pasif döngüsü, temas hasarı.
11. Boss: 2 faz, hücum telegraphı, yarı canda imp çağırma.
12. Hayalet apparition: rastgele aralıklarla ekrana giren, yavaşça yükselip kaybolan yarı saydam figür.
13. İki final: “Kopyayı al” ve “Kuyuyu kır”.
14. Duraklatma, game over, odadan devam, baştan başlama.

## Bölümler

| # | Bölüm | İçerik |
|---|---|---|
| I | Kuyu Başı | Öğretici oda, goblinler, sandık, ilk hayalet |
| II | Boğulmuş Şapel | Renk sırası bulmacası, rahip NPC, iskelet/imp |
| III | Kemik Pazarı | Sandık bulmacası, tüccar NPC, ork/imp |
| IV | Kırık Köprü | Zamanlı kapı, diken parkuru, imp |
| V | Dip | Boss (2 faz) ve final seçimi |

## Düşmanlar

- **Goblin** — hızlı takip, 2 HP.
- **İskelet** — yavaş takip, kısa hücum, 3 HP.
- **Imp** — düzensiz/sinüs hareket, 1 HP.
- **Ork** — ağır, telegraphlı hücum, 5 HP.
- **Bekçi (Big Demon)** — boss, 18 HP, 2 faz, imp çağırma.

## UI

Can kalpleri, yağ barı, kombo sayacı, hedef metni, diyalog kutusu, boss can barı, duraklatma menüsü, final seçim menüsü, başlık ekranı, game over ve iki final ekranı.

## Ses

11 Kenney SFX (swing, hit, hurt, step, break, pickup, open, ghost, select, talk, roar) + 2 Kenney jingle (title, ending). Sesler oyun içinde tetiklenir.

## 2.5D / görsel yaklaşım

- 0x72’nin 3/4 perspektifli 16×16 seti; karakterler 16×28.
- Duvarlar 16×32 yüksekliğinde iki parçalı çizilir; `z = y` sıralaması ile karakterlerin duvar arkasında kalması sağlanır.
- Karakter gölgeleri, zemin grime katmanı, üst gölge, vinyet, fener halo ve parçacıklar sabit kamera açısını bozmadan derinlik hissi verir.
- Kamera açısı sabittir; zoom 2×, oda 20×11 tile (320×176 dünya pikseli).

## Puan listesi (jüri için)

### Mekanik (+3)
1. 8 yönlü hareket
2. Kılıç kombosu + kombo sayacı
3. Dash + i-frame + afterimage
4. Fener yağı / dinamik karanlık
5. Kor patlaması (AoE stun)
6. NPC diyalog sistemi
7. Renk sırası bulmacası
8. Sandık itme bulmacası
9. Zamanlı kapı parkuru
10. Diken tuzağı döngüsü
11. Boss 2 faz + summon
12. Hayalet apparition
13. İki final seçimi
14. Duraklatma / game over / devam

### Animasyonlu karakter / düşman (+2)
Hero (knight), kız kardeş (elf), rahip (wizard), tüccar (dwarf), hayalet (angel), goblin, iskelet, imp, ork, bekçi (demon) — 10 tip.

### Animasyon durumları (+1)
idle, run, hit: hero/kız kardeş/rahip/tüccar (4×3); idle, run: hayalet/goblin/iskelet/imp/ork/demon (6×2) = 24 durum.

### Level (+2)
5 oynanabilir bölüm (Kuyu Başı, Boğulmuş Şapel, Kemik Pazarı, Kırık Köprü, Dip).

### Juice (+1)
Ekran sarsıntısı, hasar flashı, parçacık patlamaları, tween’ler, dash afterimage, fener titreşimi, ölüm parçacıkları.

### UI (+1)
Can kalpleri, yağ barı, kombo, hedef, diyalog, boss barı, duraklatma, final seçimi, başlık, game over, final ekranları.

### Ses (+1 / 2 efekt)
11 tetiklenen SFX (+5), 2 jingle (+2).

### Parallax
Bu sürümde klasik parallax katmanı yok; derinlik yüksek duvar, gölge ve ışık katmanlarıyla veriliyor.

## Assetler ve lisanslar

- **0x72 DungeonTileset II v1.7** — CC0 — https://0x72.itch.io/dungeontileset-ii
- **Kenney Tiny Dungeon** — CC0 — https://kenney.nl/assets/tiny-dungeon
- **Kenney Interface Sounds / Impact Sounds / Music Jingles** — CC0 — https://kenney.nl
- **Press Start 2P** — SIL Open Font License 1.1 — https://github.com/google/fonts/tree/main/ofl/pressstart2p
- **VT323** — SIL Open Font License 1.1 — https://github.com/google/fonts/tree/main/ofl/vt323

Lisans dosyaları: `public/assets/licenses/`.

## Notlar

- Oyun tek `npm run dev` ile açılır.
- Tüm level’lar kod/ASCII harita ile yazıldı; Tiled/Unity/Godot kullanılmadı.
- Fizik yalnızca KAPLAY’in dahili `body`/`area` sistemi.
- Asset üretim/derleme yardımcısı `tools/build-assets.mjs` yalnızca geliştirme zamanında çalışır (`pngjs` dev dependency).
