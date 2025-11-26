async function obtenerNoticias() {

    const searchText = document.getElementById("searchText").value.trim();
    const contenedor = document.getElementById("resultado");

    // Verificar input vacío
    if (!searchText) {
        contenedor.innerHTML = '<span style="color:red;">Por favor ingrese un término de búsqueda.</span>';
        return;
    }

    const apiKey = "pub_bb9912a6495a49e6b3f38e466dfbeede";
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${searchText}`;

    let myPromise = new Promise((resolve, reject) => {

        let req = new XMLHttpRequest();
        req.open("GET", url);

        req.onload = function () {
            if (req.status === 200) {
                try {
                    resolve(JSON.parse(req.responseText));
                } catch (e) {
                    reject(new Error("La respuesta JSON no es válida."));
                }
            } else {
                reject(new Error("HTTP: " + req.status));
            }
        };

        req.onerror = function () {
            reject(new Error("Error de red o CORS"));
        };

        req.send();
    });

    try {
        
        const data = await myPromise;

        if (!data.results || data.results.length === 0) {
            titulo.textContent = "Response: ";
            contenedor.innerHTML = `<span style="color:red;">Not found news.</span>`;
            return;
        }else{
        titulo.textContent = "News Found "; 
        }

        // Mostrar noticias
        let html = "";
        data.results.forEach(noticia => {
            html += `
                <div class="card mb-4 shadow-sm">
                    <div class="row g-0">

                        <div class="col-md-3">
                            ${noticia.image_url ? `
                                <img src="${noticia.image_url}" class="img-fluid rounded-start h-100"
                                style="object-fit: cover; min-height: 150px;">
                            ` : `
                                <div class="bg-light d-flex align-items-center justify-content-center h-100">
                                    <span class="text-muted">Sin imagen</span>
                                </div>
                            `}
                        </div>

                        <div class="col-md-9">
                            <div class="card-body">
                                <h5>${noticia.title || "Sin título"}</h5>
                                <p>${noticia.description || "Sin descripción disponible."}</p>

                                <div class="text-muted small">
                                    ${noticia.source_id || ""} |
                                    ${noticia.pubDate ? new Date(noticia.pubDate).toLocaleDateString() : ""}
                                </div>

                                <a href="${noticia.link}" target="_blank" class="btn btn-outline-primary btn-sm mt-2">
                                    Leer más
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            `;
        });

        contenedor.innerHTML = html;

        // MOSTRAR CONTENEDOR
        document.getElementById("contenedorResultados").classList.remove("d-none");

    } catch (error) {
        contenedor.innerHTML = "Error: " + error.message;
    }
}

