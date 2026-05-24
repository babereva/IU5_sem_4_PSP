import{a as s,s as o,H as r}from"./index-BUXPP-rM.js";class n{constructor(t,e){this.parent=t,this.id=e,this.isEdit=e!=null,this.data={src:"",title:"",text:"",description:"",category:"",age:"",inStock:!0}}async getData(){try{const{data:t,status:e}=await s.get(o.getStockById(this.id));e>=200&&e<300&&t?(this.data={...this.data,...t},this.fillForm()):console.error("Ошибка загрузки карточки для редактирования. Статус:",e)}catch(t){console.error("Сетевая ошибка при загрузке карточки:",t)}}fillForm(){const t=(i,l)=>{const a=document.getElementById(`field-${i}`);a&&(a.value=l??"")};t("src",this.data.src),t("title",this.data.title),t("text",this.data.text),t("description",this.data.description),t("category",this.data.category),t("age",this.data.age);const e=document.getElementById("field-inStock");e&&(e.checked=!!this.data.inStock)}getFormHTML(){return`
            <div id="edit-page">
                <section class="edit-section">
                    <div class="container">
                        <h2 class="section-title">${this.isEdit?"Редактирование карточки":"Добавление карточки"}</h2>
                        <div class="edit-form-wrap">
                            <div class="form-row">
                                <label class="form-label" for="field-title">Название</label>
                                <input class="form-input" id="field-title" type="text" placeholder="Например: Биойогурт">
                            </div>
                            <div class="form-row">
                                <label class="form-label" for="field-text">Краткое описание</label>
                                <input class="form-input" id="field-text" type="text" placeholder="Например: с малиной и шиповником">
                            </div>
                            <div class="form-row">
                                <label class="form-label" for="field-description">Полное описание</label>
                                <textarea class="form-input form-textarea" id="field-description" rows="4" placeholder="Подробное описание продукта..."></textarea>
                            </div>
                            <div class="form-row">
                                <label class="form-label" for="field-category">Категория</label>
                                <input class="form-input" id="field-category" type="text" placeholder="Например: Йогурты">
                            </div>
                            <div class="form-row">
                                <label class="form-label" for="field-age">Возраст</label>
                                <input class="form-input" id="field-age" type="text" placeholder="Например: от 8 мес.">
                            </div>
                            <div class="form-row">
                                <label class="form-label" for="field-src">Ссылка на изображение</label>
                                <input class="form-input" id="field-src" type="text" placeholder="https://...">
                            </div>
                            <div class="form-row form-row-checkbox">
                                <label class="form-label" for="field-inStock">В наличии</label>
                                <input id="field-inStock" type="checkbox" checked>
                            </div>

                        </div>
                    </div>
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
        `}render(t,e){this.parent.innerHTML="",new r(this.parent,{onHome:t,onAnalytics:e}).render(),this.parent.insertAdjacentHTML("beforeend",this.getFormHTML()),this.isEdit&&this.getData()}}export{n as EditPage};
