# TeaTable

TeaTable, web uygulamalarınız için hızlı ve kolay bir şekilde dinamik tablolar oluşturmanıza olanak tanıyan bir JavaScript kütüphanesidir. CRUD işlemleri, sıralama, arama, tam ekran görüntüleme, CSV'ye aktarma ve sayfalama özelliklerini destekler. 


## Kurulum (Installation)

Kütüphaneyi projenize dahil etmek için aşağıdaki komutu kullanabilirsiniz:

```bash
npm i teatable
```

_Eğer import etmeden kullanmak istiyorsanız koddan 'export default' satırını yorum içine alarak projenize dahil edebilirsiniz._

## Özellikler / Features

- CRUD İşlemleri: Veri ekleme, okuma, güncelleme ve silme işlevleri.
- Sıralama: Her sütun başlığına tıklandığında ilgili sütuna göre sıralama.
- Arama: Tablo verileri üzerinde anlık arama yapma.
- Tam Ekran: Tabloyu tam ekran modunda görüntüleme.
- CSV'ye Aktarma: Tablo verilerini CSV formatında dışa aktarma.
- Sayfalama: Büyük veri setleri için sayfa sayfa gezinme.

## Kullanım (Usage)

Kütüphaneyi kullanmak için öncelikle TeaTable sınıfını projenize import edin ve bir örnek (instance) oluşturun.

```
import TeaTable from 'teatable';

const options = {
    data: [...], // Başlangıç veri dizisi
    rowsPerPage: 5, // Opsiyonel: Sayfa başına satır sayısı (varsayılan: 5)
    // Opsiyonel: Callback fonksiyonları
    onCreate: (item) => { /* ... */ },
    onEdit: (item, index) => { /* ... */ },
    onDelete: (item, index) => { /* ... */ }
};

const myTable = new TeaTable('tableContainerId', options);
```

Bu kod, belirtilen tableContainerId ID'li bir HTML elementi içerisine bir tablo oluşturur.

## Stil Ekleme (Styling)

Kütüphaneyi görsel açıdan iyileştirmek için, aşağıdaki CSS dosyasını projenize dahil edin:

```html
<link rel="stylesheet" href="node_modules/your-library-name/theme1.css">
```

veya

```import 'your-library-name/theme1.css';```


## Eklenecekler (What's Next?)

- Dark Mode or Theme Selector ADDED
- Multilanguage support ADDED
- Async pagination support


## Links
- NpmJs - https://www.npmjs.com/package/teatable
- Github - https://github.com/hkkcngz/teatable
- CodePen - https://codepen.io/hkkcngz/pen/vYbaYXa


### Lisans

Bu proje MIT lisansı altında lisanslanmıştır.