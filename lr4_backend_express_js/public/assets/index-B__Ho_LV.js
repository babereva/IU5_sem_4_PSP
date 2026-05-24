import{a as o,s as r,H as d}from"./index-BUptzlc2.js";class f{constructor(e,t){this.parent=e,this.id=t,this.isEdit=t!=null,this.data={src:"",title:"",text:"",description:"",category:"",age:"",inStock:!0}}async getData(){try{const{data:e,status:t}=await o.get(r.getStockById(this.id));t>=200&&t<300&&e?(this.data={...this.data,...e},this.fillForm()):console.error("Ошибка загрузки карточки для редактирования. Статус:",t)}catch(e){console.error("Сетевая ошибка при загрузке карточки:",e)}}fillForm(){const e=(s,a)=>{const i=document.getElementById(`field-${s}`);i&&(i.value=a??"")};e("src",this.data.src),e("title",this.data.title),e("text",this.data.text),e("description",this.data.description),e("category",this.data.category),e("age",this.data.age);const t=document.getElementById("field-inStock");t&&(t.checked=!!this.data.inStock)}getFormHTML(){return`
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

                            <div class="edit-actions">
                                <button class="btn-save" id="btn-save" type="button">Сохранить</button>
                            </div>
                            <p class="edit-status" id="edit-status"></p>
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
        `}collectForm(){const e=s=>{var a;return((a=document.getElementById(`field-${s}`))==null?void 0:a.value)??""},t=document.getElementById("field-inStock");return{src:e("src"),title:e("title"),text:e("text"),description:e("description"),category:e("category"),age:e("age"),inStock:t?!!t.checked:!0}}async saveData(e){const t=document.getElementById("edit-status"),s=document.getElementById("btn-save"),a=this.collectForm();if(!a.title.trim()){t&&(t.textContent="Введите название карточки",t.className="edit-status edit-status-error");return}s&&(s.disabled=!0),t&&(t.textContent="Сохраняем…",t.className="edit-status");try{const{data:i,status:l}=this.isEdit?await o.patch(r.updateStockById(this.id),a):await o.post(r.createStock(),a);l>=200&&l<300&&i?(t&&(t.textContent="Сохранено!",t.className="edit-status edit-status-ok"),setTimeout(()=>e&&e(),600)):(t&&(t.textContent=`Ошибка сохранения. Статус: ${l}`,t.className="edit-status edit-status-error"),s&&(s.disabled=!1),console.error("Ошибка сохранения. Статус:",l,"Ответ:",i))}catch(i){t&&(t.textContent="Сетевая ошибка. Сервер недоступен.",t.className="edit-status edit-status-error"),s&&(s.disabled=!1),console.error("Сетевая ошибка при сохранении:",i)}}render(e,t){this.parent.innerHTML="",new d(this.parent,{onHome:e,onAnalytics:t}).render(),this.parent.insertAdjacentHTML("beforeend",this.getFormHTML()),document.getElementById("btn-save").addEventListener("click",()=>this.saveData(e)),this.isEdit&&this.getData()}}export{f as EditPage};
