import{a as r,s as a,H as i}from"./index-BUptzlc2.js";class n{constructor(t){this.parent=t}getHTML(t){return`
            <div class="product-detail">
                <img class="product-detail-img" src="${t.src}" alt="${t.title}">
                <div class="product-detail-info">
                    <span class="product-detail-category">${t.category}</span>
                    <h2 class="product-detail-title">${t.title}</h2>
                    <p class="product-detail-text">${t.text}</p>
                    <p class="product-detail-text">${t.description}</p>
                    <span class="product-detail-age">Возраст: ${t.age}</span>
                </div>
            </div>
        `}render(t){this.parent.insertAdjacentHTML("beforeend",this.getHTML(t))}}class p{constructor(t,e){this.parent=t,this.id=e}get pageRoot(){return document.querySelector("#product-page .product-section .container")}async getData(){try{const{data:t,status:e}=await r.get(a.getStockById(this.id));e>=200&&e<300&&t?this.renderData(t):(this.pageRoot&&(this.pageRoot.innerHTML='<p class="no-results">Не удалось загрузить карточку с сервера.</p>'),console.error("Ошибка загрузки карточки. Статус:",e))}catch(t){this.pageRoot&&(this.pageRoot.innerHTML='<p class="no-results">Сервер недоступен.</p>'),console.error("Сетевая ошибка при загрузке карточки:",t)}}renderData(t){new n(this.pageRoot).render(t)}getHTML(){return`
            <div id="product-page">
                <section class="product-section">
                    <div class="container"></div>
                </section>
                <footer class="footer">
                    <div class="container footer-inner">
                        <a href="#">
                            <img src="https://mir-tema.ru/header-logo.webp" alt="Тёма" class="footer-logo">
                        </a>
                        <p class="footer-copy">2026 Лабораторная работа. Молочная кухня.</p>
                    </div>
                </footer>
            </div>
        `}render(t,e,s){this.parent.innerHTML="",new i(this.parent,{onHome:t,onAnalytics:e}).render(),this.parent.insertAdjacentHTML("beforeend",this.getHTML()),this.pageRoot.insertAdjacentHTML("beforeend",`
            <div class="product-actions">
                <button class="btn-edit" id="btn-edit">Редактировать</button>
            </div>
        `),s&&document.getElementById("btn-edit").addEventListener("click",s),this.getData()}}export{p as ProductPage};
