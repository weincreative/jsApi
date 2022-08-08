const app = require('express')();
const PORT = 8080;

const reservations = [
    { "Ad": "Vagon1", "Kapasite": 100, "DoluKoltukAdet": 68 },
    { "Ad": "Vagon2", "Kapasite": 90, "DoluKoltukAdet": 50 },
    { "Ad": "Vagon3", "Kapasite": 80, "DoluKoltukAdet": 80 }
]

app.get(`/`, (req, res) => {
    res.status(200).send('Başkent Ekspress Hoş geldiniz.... Örnek: ===> http://localhost:8080/api/rez/[Rezervasyon Yapılacak Kişi Sayısı] / [Rezervasyon Farklı Vagonlara Verilsin Mi ? (true/false)] <=== Yandaki gibi deneyebilirsiniz..')
});

app.get("/api/rez/:RezervasyonYapilacakKisiSayisi/:KisilerFarkliVagonlaraYerlestirilebilir", async function(req,res){
        const muchmorereservations = []
        var r1 = parseInt(req.params.RezervasyonYapilacakKisiSayisi)
        const r2 = req.params.KisilerFarkliVagonlaraYerlestirilebilir
        var controller = 0
        var BosKoltukAdet = 0

        if (r2 === 'true'){
            for (let i = 0; i < reservations.length; i++) {
                var kapasiteKontrol = (reservations[i].Kapasite * 0.7) - reservations[i].DoluKoltukAdet
                if (kapasiteKontrol > 0) { BosKoltukAdet += parseInt(kapasiteKontrol) }
            }
     
            if (BosKoltukAdet >= r1){
                for (let i = 0; i < reservations.length; i++) {
                    var kapasiteKontrol = parseInt((reservations[i].Kapasite * 0.7) - reservations[i].DoluKoltukAdet)
                    if (r1 > 0){
                        if (kapasiteKontrol <= r1){
                            muchmorereservations.push({ 'VagonAdi': reservations[i].Ad, 'KisiSayisi':kapasiteKontrol})
                            r1 -= kapasiteKontrol
                        }else{
                            muchmorereservations.push({ 'VagonAdi': reservations[i].Ad, 'KisiSayisi': r1 })
                            r1 = 0
                        }
                    }
                }
                res.json({ 'RezervasyonYapilabilir': r2, 'YerlesimAyrinti': muchmorereservations })
                controller = 1
            }
        } else {
            if (r2 === 'false') {
                for (let i = 0; i < reservations.length; i++){
                    var kapasiteKontrol = (reservations[i].Kapasite * 0.7) - reservations[i].DoluKoltukAdet
                    if (kapasiteKontrol >= r1) {
                        res.json({ 'RezervasyonYapilabilir': r2, 'YerlesimAyrinti': [{ 'VagonAdi': reservations[i].Ad, 'KisiSayisi': r1 }] })
                        controller = 1
                        break
                    }
                }
            } 
        }
    if (controller === 0) {
        res.json({ 'RezervasyonYapilabilir': r2, 'YerlesimAyrinti': [] })
    }
});

app.listen(PORT,() => {
    console.log(`Live on http://localhost:${PORT}`);
});