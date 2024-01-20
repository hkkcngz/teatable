class TeaTable {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.data = options.data || [];
        this.currentPage = 1;
        this.rowsPerPage = options.rowsPerPage || 10;
        this.sortDirection = true;
        this.tableId = "dataTable";
        this.callbacks = {
            onCreate: options.onCreate || null,
            onEdit: options.onEdit || null,
            onDelete: options.onDelete || null
            // Diğer callback'ler eklenebilir
        };
        //this.language = options.language || 'tr';
        this.themeColor = options.themeColor || "#6967ce";
        
        this.txtAdd = options.txtAdd || "Ekle";
        this.txtUpdate = options.txtUpdate || "Güncelle";
        this.txtDel = options.txtDel || "Sil";
        this.txtEdit = options.txtEdit || "Düzenle";
        this.txtAct = options.txtAct || "Eylem";
        this.txtSearch = options.txtSearch || "Ara...";
        this.txtPage = options.txtPage || "Sayfa";
        this.txtConfirm = options.txtConfirm || "Bu veriyi silmek istediğinize emin misiniz?";

        this.init();
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
        container.querySelector('#toggleDarkMode').addEventListener('click', () => this.toggleDarkMode());

        this.loadDataToTable();
    }

    getTableHTML() {
        // Tablonun HTML yapısını döndür
        return `
        <section id="teatable" style="--main-color:${this.themeColor}">
            <!-- Tablo kontrolleri -->
            <header class="table-controls">
                <button id="addData"><svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai ai-Plus"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4"/></svg></button>
                <input type="text" id="searchBox" placeholder="${this.txtSearch}">
                <div class="btn-group"><button id="fullscreenButton"><svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai ai-FullScreen"><path d="M2 7V2h5"/><path d="M22 7V2h-5"/><path d="M7 22H2v-5"/><path d="M17 22h5v-5"/></svg></button>
                <button id="exportButton"><svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai ai-Download"><path d="M12 15V3m0 12l-4-4m4 4l4-4"/><path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21H19.439a2 2 0 0 0 1.94-1.515L22 17"/></svg></button>
                <button id="toggleDarkMode"><svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="currentColor" stroke-width="2" class="ai ai-MoonFill"><path d="M20.958 15.325c.204-.486-.379-.9-.868-.684a7.684 7.684 0 0 1-3.101.648c-4.185 0-7.577-3.324-7.577-7.425a7.28 7.28 0 0 1 1.134-3.91c.284-.448-.057-1.068-.577-.936C5.96 4.041 3 7.613 3 11.862 3 16.909 7.175 21 12.326 21c3.9 0 7.24-2.345 8.632-5.675z"/><path d="M15.611 3.103c-.53-.354-1.162.278-.809.808l.63.945a2.332 2.332 0 0 1 0 2.588l-.63.945c-.353.53.28 1.162.81.808l.944-.63a2.332 2.332 0 0 1 2.588 0l.945.63c.53.354 1.162-.278.808-.808l-.63-.945a2.332 2.332 0 0 1 0-2.588l.63-.945c.354-.53-.278-1.162-.809-.808l-.944.63a2.332 2.332 0 0 1-2.588 0l-.945-.63z"/></svg></button></div>
            </header>
            <!-- Veri formu -->
            <section id="dataForm" class="hidden"></section>
            <!-- Tablo -->
            <table id="dataTable">
                <thead></thead>
                <tbody></tbody>
            </table>
            <!-- Sayfalama -->
            <footer class="pagination-controls">
                <button id="prevPage"><svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai ai-ChevronLeft"><path d="M15 4l-8 8 8 8"/></svg></button>
                <span id="pageInfo"></span>
                <button id="nextPage"><svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai ai-ChevronRight"><path d="M8 4l8 8-8 8"/></svg></button>
            </footer>
        </section>`;
    }

    // ...
    toggleDarkMode() {
        const container = document.getElementById(this.containerId);
        container.querySelector('#teatable').classList.toggle('dark-mode');

        // Dark mode durumunu buton metninde güncelle
        const darkModeButton = document.getElementById('toggleDarkMode');
        if (container.classList.contains('dark-mode')) {
            darkModeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="currentColor" stroke-width="2" class="ai ai-ToggleOffFill"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 7a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10H7zm0 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>';
        } else {
            darkModeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="currentColor" stroke-width="2" class="ai ai-ToggleOffFill"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 7a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10H7zm0 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>';
        }
    }

    setDataAttributes() {
        const table = document.getElementById(this.tableId);
        const headers = table.querySelectorAll('thead th');
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            row.querySelectorAll('td').forEach((cell, index) => {
                if (headers[index]) {
                    cell.setAttribute('data-th', headers[index].textContent);
                }
            });
        });
    }

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
        actionTh.textContent = this.txtAct;
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
                cell.textContent = typeof item[key] == "object" ? JSON.stringify(item[key]) : item[key];
            });
    
            // Eylem butonlarını ekle
            let actionCell = row.insertCell();
            let editButton = document.createElement('button');
            editButton.textContent = this.txtEdit;
            editButton.onclick = () => this.editData(item.id);
    
            let deleteButton = document.createElement('button');
            deleteButton.classList.add('btn-danger');
            deleteButton.textContent = this.txtDel;
            deleteButton.onclick = () => this.deleteData(item.id);

            let groupButton = document.createElement('div');
            groupButton.classList.add('btn-group');
            groupButton.appendChild(editButton)
            groupButton.appendChild(deleteButton);
            actionCell.appendChild(groupButton);
        });
    
        // Veri yoksa boş bir satır ekle
        if (this.data.length === 0) {
            let row = tbody.insertRow();
            let cell = row.insertCell();
            cell.colSpan = keys.length + 1; // Tüm sütunları kapsar
            cell.textContent = 'Veri Yok';
        }
    
        // Verileri yükledikten sonra data-th niteliklerini ayarla
        this.setDataAttributes();

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
                input.value = editData ? (editData[key] ?? '') : '';
                formDiv.appendChild(input);
            }
        });
    
        let submitButton = document.createElement('button');
        submitButton.textContent = editData ? this.txtUpdate : this.txtAdd;
        submitButton.classList.add('btn-action');
        submitButton.addEventListener('click', () => {
            this.submitForm(editData ? editData.id : null);
            if(editData) formDiv.classList.add('hidden');
        });
        formDiv.appendChild(submitButton);

        let cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('btn-action');
        cancelButton.addEventListener('click', () => {
            formDiv.classList.add('hidden');
        });
        formDiv.appendChild(cancelButton);
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
            formData.id = this.data.length > 0 ? (this.data[this.data.length - 1].id * 1) + 1 : 1;
            this.data.push(formData);
            if (typeof this.callbacks.onCreate === 'function') {
                this.callbacks.onCreate(formData);
            }
        } else {
            // Mevcut veriyi güncelleme
            const index = this.data.findIndex(item => item.id === id);
            if (index !== -1) {
                this.data[index] = { ...this.data[index], ...formData };
            }
            if (typeof this.callbacks.onEdit === 'function') {
                this.callbacks.onEdit(id, this.data[index]);
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
        }
    }
    
    deleteData(id) {
        if (confirm(this.txtConfirm)) {
            this.data = this.data.filter(item => item.id !== id);
            this.loadDataToTable();

            if (typeof this.callbacks.onDelete === 'function') {
                this.callbacks.onDelete(id);
            }
        }
    }

    filterTable(searchText) {
        const rows = document.getElementById(this.tableId).getElementsByTagName('tbody')[0].rows;
        let searchTextLower = searchText.toLowerCase();
        
        if (searchTextLower) {
            // Arama metni varsa, sayfalama ayarını geçici olarak değiştir
            this.tempRowsPerPage = this.rowsPerPage;
            this.rowsPerPage = 100;  // Tüm satırları tek sayfada göster
            this.currentPage = 1;  // Sayfayı ilk sayfaya ayarla
            this.changePage(0)

            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                let allCellText = '';
                for (let j = 0; j < row.cells.length - 1; j++) {
                    allCellText += row.cells[j].textContent.toLowerCase() + ' ';
                }
                row.style.display = allCellText.includes(searchTextLower) ? '' : 'none';
            }
        } else {
            // Arama metni yoksa, sayfalama ayarlarını eski haline getir
            this.rowsPerPage = this.tempRowsPerPage;
            this.loadDataToTable();
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
        pageInfo.textContent = `${this.txtPage} ${this.currentPage} / ${totalPages}`;
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

}

export default TeaTable;