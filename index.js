class TeaTable {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.data = options.data || [];
        this.currentPage = 1;
        this.rowsPerPage = options.rowsPerPage || 5;
        this.sortDirection = true;
        this.tableId = "dataTable";
        this.callbacks = {
            onCreate: options.onCreate || null,
            onEdit: options.onEdit || null,
            onDelete: options.onDelete || null
            // Diğer callback'ler eklenebilir
        };
        this.theme = options.theme || 'default'; // Varsayılan tema
        this.applyTheme();
        this.init();
    }

    applyTheme() {
        const container = document.getElementById(this.containerId);
        container.className = ''; // Mevcut tüm sınıfları temizle
        if (this.theme !== 'default') {
            container.classList.add(this.theme);
        }
    }

    init() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = this.getTableHTML();

        // Event listener'ları ekleme
        container.querySelector('#addData').addEventListener('click', () => this.createForm());
        container.querySelector('#searchBox').addEventListener('input', this.debounce((event) => this.filterTable(event.target.value), 300));
        container.querySelector('#fullscreenButton').addEventListener('click', () => this.toggleFullScreen());
        container.querySelector('#exportButton').addEventListener('click', () => this.exportTableToCSV('export.csv'));
        container.querySelector('#prevPage').addEventListener('click', () => this.changePage(-1));
        container.querySelector('#nextPage').addEventListener('click', () => this.changePage(1));

        this.loadDataToTable();
    }

    getTableHTML() {
        // Tablonun HTML yapısını döndür
        return `
            <!-- Tablo kontrolleri -->
            <button id="addData">Yeni Veri Ekle</button>
            <input type="text" id="searchBox" placeholder="Ara...">
            <button id="fullscreenButton">Tam Ekran</button>
            <button id="exportButton">Export to CSV</button>

            <!-- Veri formu -->
            <div id="dataForm" class="hidden"></div>

            <!-- Tablo -->
            <table id="dataTable">
                <thead></thead>
                <tbody></tbody>
            </table>

            <!-- Sayfalama -->
            <div id="pagination">
                <button id="prevPage">Önceki Sayfa</button>
                <span id="pageInfo"></span>
                <button id="nextPage">Sonraki Sayfa</button>
            </div>
        `;
    }

    // loadDataToTable, createForm, editData, deleteData, ve diğer gerekli metodlar
    // ...

    // Örnek metodlar:
    loadDataToTable() {
        const table = document.getElementById(this.tableId);
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
    
        // Tablo başlıklarını ayarla
        thead.innerHTML = '';
        let headerRow = thead.insertRow(0);
        let keys = this.getAllKeys(this.data);
    
        keys.forEach(key => {
            let th = document.createElement('th');
            th.textContent = key;
            th.addEventListener('click', () => this.sortTableByColumn(key));
            headerRow.appendChild(th);
        });
    
        // "Action" sütun başlığını ekle
        let actionTh = document.createElement('th');
        actionTh.textContent = 'Action';
        headerRow.appendChild(actionTh);
    
        // Veri satırlarını ayarla
        tbody.innerHTML = '';
        const start = (this.currentPage - 1) * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        const paginatedItems = this.data.slice(start, end);
    
        paginatedItems.forEach(item => {
            let row = tbody.insertRow();
            keys.forEach(key => {
                let cell = row.insertCell();
                cell.textContent = item[key];
            });
    
            // Eylem butonlarını ekle
            let actionCell = row.insertCell();
            let editButton = document.createElement('button');
            editButton.textContent = 'Düzenle';
            editButton.onclick = () => this.editData(item.id);
            actionCell.appendChild(editButton);
    
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Sil';
            deleteButton.onclick = () => this.deleteData(item.id);
            actionCell.appendChild(deleteButton);
        });
    
        // Veri yoksa boş bir satır ekle
        if (this.data.length === 0) {
            let row = tbody.insertRow();
            let cell = row.insertCell();
            cell.colSpan = keys.length + 1; // Tüm sütunları kapsar
            cell.textContent = 'Veri Yok';
        }
    
        this.updatePageInfo();
    }

    createForm(editData = null) {
        const formDiv = document.getElementById('dataForm');
        formDiv.innerHTML = '';
        formDiv.classList.remove('hidden');
    
        let keys = this.getAllKeys(this.data);
        keys.forEach(key => {
            if (key !== 'id') { // 'id' alanını formda göstermeyin
                let input = document.createElement('input');
                input.type = 'text';
                input.placeholder = key;
                input.id = 'form-' + key;
                input.value = editData ? editData[key] : '';
                formDiv.appendChild(input);
                formDiv.appendChild(document.createElement('br'));
            }
        });
    
        let submitButton = document.createElement('button');
        submitButton.textContent = editData ? 'Güncelle' : 'Ekle';
        submitButton.addEventListener('click', () => {
            this.submitForm(editData ? editData.id : null);
            formDiv.classList.add('hidden');
        });
        formDiv.appendChild(submitButton);
    }
    submitForm(id) {
        const formData = {};
        this.getAllKeys(this.data).forEach(key => {
            if (key !== 'id') {
                formData[key] = document.getElementById('form-' + key).value;
            }
        });
    
        if (id === null) {
            // Yeni veri ekleme
            formData.id = this.data.length > 0 ? this.data[this.data.length - 1].id + 1 : 1;
            this.data.push(formData);
        } else {
            // Mevcut veriyi güncelleme
            const index = this.data.findIndex(item => item.id === id);
            if (index !== -1) {
                this.data[index] = { ...this.data[index], ...formData };
            }
        }
        
        this.loadDataToTable();
    }
    getAllKeys(data) {
        const allKeys = new Set();
        data.forEach(item => {
            Object.keys(item).forEach(key => allKeys.add(key));
        });
        return Array.from(allKeys);
    }

    editData(id) {
        const editItem = this.data.find(item => item.id === id);
        if (editItem) {
            this.createForm(editItem);

            if (typeof this.callbacks.onEdit === 'function') {
                this.callbacks.onEdit(editItem);
            }
        }
    }
    
    deleteData(id) {
        if (confirm("Bu veriyi silmek istediğinize emin misiniz?")) {
            this.data = this.data.filter(item => item.id !== id);
            this.loadDataToTable();

            if (typeof this.callbacks.onDelete === 'function') {
                this.callbacks.onDelete(id);
            }
        }
    }

    filterTable(searchText) {
        const rows = document.getElementById(this.tableId).getElementsByTagName('tbody')[0].rows;
    
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let allCellText = '';
            for (let j = 0; j < row.cells.length - 1; j++) { // -1, "Action" sütununu hariç tutmak için
                allCellText += row.cells[j].textContent.toLowerCase() + ' ';
            }
    
            if (allCellText.indexOf(searchText.toLowerCase()) === -1) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        }
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    toggleFullScreen() {
        const container = document.getElementById(this.containerId);
        
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement ) {
            // Tam ekran moduna geç
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            // Tam ekran modundan çık
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    changePage(amount) {
        const totalPages = Math.ceil(this.data.length / this.rowsPerPage);
        this.currentPage += amount;
    
        if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
        } else if (this.currentPage < 1) {
            this.currentPage = 1;
        }
    
        this.loadDataToTable();
    }

    updatePageInfo() {
        const pageInfo = document.getElementById('pageInfo');
        const totalPages = Math.ceil(this.data.length / this.rowsPerPage);
        pageInfo.textContent = `Sayfa ${this.currentPage} / ${totalPages}`;
    }
    
    sortTableByColumn(column) {
        if (this.sortColumn === column) {
            // Aynı sütuna tekrar tıklandığında sıralama yönünü değiştir
            this.sortDirection = !this.sortDirection;
        } else {
            // Farklı bir sütuna tıklandığında varsayılan olarak artan sıralama yap
            this.sortDirection = true;
            this.sortColumn = column;
        }
    
        this.data.sort((a, b) => {
            if (a[column] < b[column]) {
                return this.sortDirection ? -1 : 1;
            }
            if (a[column] > b[column]) {
                return this.sortDirection ? 1 : -1;
            }
            return 0;
        });
    
        this.loadDataToTable();
    }
    
    exportTableToCSV(filename) {
        const csv = [];
        const rows = document.getElementById(this.tableId).querySelectorAll("tr");
    
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll("td, th");
            const row = Array.from(cells).map(cell => {
                let cellText = cell.textContent.replace(/"/g, '""'); // Çift tırnakları escape et
                return `"${cellText}"`; // Her hücreyi çift tırnak içine al
            }).join(",");
            csv.push(row);
        }
    
        this.downloadCSV(csv.join("\n"), filename);
    }

    downloadCSV(csv, filename) {
        const csvFile = new Blob([csv], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    // Diğer yardımcı metodlar (filterTable, toggleFullScreen, exportTableToCSV, vb.)
    // ...


}

export default TeaTable;