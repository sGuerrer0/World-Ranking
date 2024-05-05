const formatter = new Intl.NumberFormat('es-CL', {
    // style: 'currency',
    currency: 'CLP',
});

var global_data = [];

function call_countries() {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            create_countries_table(data);
            global_data = data;
        })
        .catch(error => {
            console.log(error)
        })
}

function create_countries_table(data) {
    $("#countries_body").empty();

    let countries = [];
    let html = "";

    countries = data;
    const { length } = countries;

    countries.forEach(co => {
        const name = co['name']['common'];

        const onclick = `onclick="get_details('` + name + `')"`;
        html += `<tr ` + onclick + ` class="tr-hov" >
                    <td class="padd-right color-w"><img style="object-fit:contain; width: 50px; height:50px;" src="`+ co['flags']['svg'] + `" alt="` + co['flags']['alt'] + `"></img></td>
                    <td class="padd-right color-w">`+ co['name']['common'] + `</td>
                    <td class="padd-right color-w">`+ formatter.format(co['population']) + `</td>
                    <td class="padd-right color-w">`+ formatter.format(co['area']) + `</td>
                    <td class="padd-right color-w">`+ co['region'] + `</td>
                </tr>`;

    });

    $("#count_contries").text(length);
    $("#countries_body").append(html);
}

function get_details(name) {
    const country = global_data.filter(el => el['name']['common'] == name)
    const borders = country[0]['borders'];
    const qty = country[0]['borders'].length;
    let neigh_info = "";

    if (typeof(borders) != "undefined") {
        for (let i = 0; i < borders.length; i++) {
            let neighbors = global_data.filter(el => el['cca3'] == borders[i] || el['cioc'] == borders[i]);
            if (neighbors.length > 0) {
                const flags = neighbors[0]['flags']['svg'];
                const alt = neighbors[0]['flags']['alt'];
                const neigh_name = neighbors[0]['name']['common'];
                neigh_info += `
                        <div style="width: 100px; padding: 10px;">
                        <img style="object-fit:contain; width: 100%; height:auto;" src="`+ flags + `" alt="` + alt + `"></img><br>
                        <span class="form-label">`+neigh_name+`</span>
                        </div>
                        
                           
                `;
            }
        }
    }

    const currencies = Object.values(country[0]['currencies'])[0]['name'];
    const languages = Object.values(country[0]['languages']).join(", ");

    $("#card_countries_details").html(`
    <div class="card-body">
    <a href="#" onclick="back_countries();"><img width="30px" src="assets/icons8-arrow-left-96.png" alt=""></a>
    <div class="text-center">
            <h3 class="color-w">`+ name + `</h3>
            <span class="color-w">`+ country[0]['name']['official'] + `</span>    
        </div>
        <div class="center-div-center mt-5">
            <div class="bg-color-g-1 div-detail-PA">
                <span class="color-w f-size-14">Population</span><span class="mx-3" style="color: #1B1D1F;">|</span><span class="color-w f-size-14"> `+ formatter.format(country[0]['population']) + `</span>
            </div>
            <div class="bg-color-g-1 div-detail-PA" style="margin-left:20px !important;">
                <span class="color-w f-size-14">Area (km²)</span><span class="mx-3" style="color: #1B1D1F;">|</span><span class="color-w f-size-14"> `+ formatter.format(country[0]['area']) + `</span>
            </div>
        </div>
        <hr>
        <div class="center-div"><span class="f-size-14">Capital</span><span class="f-size-14 color-w">`+ country[0]['capital'] + `</span></div>
        <hr class="color-g">
        <div class="center-div"><span class="f-size-14">Subregion</span><span class="f-size-14 color-w">`+ country[0]['subregion'] + `</span></div>
        <hr>
        <div class="center-div"><span class="f-size-14">Language</span><span class="f-size-14 color-w">`+ languages + `</span></div>
        <hr>
        <div class="center-div"><span class="f-size-14">Currencies</span><span class="f-size-14 color-w">`+ currencies + `</span></div>
        <hr>
        <div class="center-div"><span class="f-size-14">Continents</span><span class="f-size-14 color-w">`+ country[0]['continents'] + `</span></div>
        <hr>
        <div>
            <span class="f-size-14">Neighbouring Countries</span>
            <div id="neighbouring_c" style="display: grid; grid-template-columns:repeat(auto-fit, minmax(80px, 1fr)); gap:10px;">`+neigh_info+`</div>
        </div>
    </div>
    `);

    document.getElementById("card_countries_table").style.display = "none";
    document.getElementById("card_countries_details").style.display = "block";
}

function back_countries(){
    document.getElementById("card_countries_table").style.display = "block";
    document.getElementById("card_countries_details").style.display = "none";
}

function search_filter(filter) {
    let search = document.getElementById("search_filter").value.toLowerCase().trim();
    let sel_options = document.getElementById("sorting_fil").value
    console.log(search)
    let filtered_data = [];
    filtered_data = global_data;
    // Falta filtro de subregion
    filtered_data = global_data.filter(el => el['name']['common'].toLowerCase().includes(search) || el['region'].toLowerCase().includes(search));

    create_countries_table(filtered_data)
}

$(document).ready(function () {
    call_countries();
}); 