import{a as c,c as u,b as t,_ as G,e as i,t as s,f as R,F,j as k,r as b,i as Y,o as Q,k as L,g as m,s as h,v as w,A as W,l as E,x as H,u as J}from"./index-BVvMpWDb.js";import{u as K}from"./venta.store-Rvdo0A6Z.js";import{_ as U}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./axios-BcB5iGDJ.js";import"./index-C0Zqfgkc.js";const X={class:"header"},Z={class:"logo-section"},tt={class:"info-section"},et={key:0},ot={class:"productos-table"},at={class:"totales-section"},lt={class:"totales-grid"},nt={class:"totales-grid"},st={class:"totales-grid total-final"},rt={class:"footer"},it={class:"footer-col"},dt={__name:"FacturaImprimible",props:{factura:{type:Object,required:!0,default:()=>({numero_factura:"",fecha:"",cliente_nombre:"",cliente_rnc:"",productos:[],subtotal:0,impuestos:0,total:0,banco:"",cuenta:"",alias:""})}},setup(d,{expose:C}){const _=d,f=b(null);function x(r){if(!r)return"";const l=new Date(r);return`${l.getDate()} de ${l.toLocaleDateString("es-DO",{month:"long"})} de ${l.getFullYear()}`}function g(r){return`${(r||0).toLocaleString("es-DO")}$`}function y(){if(!f.value)return;f.value.style.display="block";const r=document.createElement("iframe");r.style.position="absolute",r.style.width="0px",r.style.height="0px",r.style.border="none",document.body.appendChild(r);const l=r.contentWindow.document;l.open(),l.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura ${_.factura.numero_factura}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page { margin: 20mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'DM Sans', sans-serif; color: #1a1a1a; line-height: 1.6; }
          ${a()}
        </style>
      </head>
      <body>
        ${f.value.innerHTML}
      </body>
    </html>
  `),l.close(),setTimeout(()=>{r.contentWindow.print(),setTimeout(()=>{document.body.removeChild(r),f.value.style.display="none"},100)},500)}function a(){return`
    .factura-print {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: white;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    .logo-img {
      max-width: 150px;
      max-height: 80px;
      object-fit: contain;
    }
    .title-section h1 {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1.1;
      margin: 0;
      text-align: right;
    }
    .info-section {
      margin-bottom: 30px;
    }
    .info-section p {
      margin: 8px 0;
      font-size: 1rem;
    }
    .productos-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .productos-table thead {
      background: #1a1a1a;
      color: white;
    }
    .productos-table th {
      padding: 12px;
      text-align: left;
      font-weight: 700;
      font-size: 0.9rem;
      text-transform: uppercase;
    }
    .productos-table td {
      padding: 12px;
      font-size: 0.95rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .productos-table tbody tr:last-child td {
      border-bottom: 2px solid #1a1a1a;
    }
    .totales-section {
      margin-left: auto;
      max-width: 350px;
      margin-bottom: 40px;
    }
    .totales-grid {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 20px;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 1rem;
    }
    .totales-grid.total-final {
      border-top: 2px solid #1a1a1a;
      border-bottom: 2px solid #1a1a1a;
      padding: 15px 0;
      font-size: 1.2rem;
      margin-top: 10px;
    }
    .footer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      padding-top: 30px;
      border-top: 2px solid #f0f0f0;
    }
    .footer-col h3 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .footer-col p {
      margin: 6px 0;
      font-size: 0.9rem;
    }
  `}return C({imprimir:y}),(r,l)=>(c(),u("div",{class:"factura-print",ref_key:"facturaRef",ref:f,style:{display:"none"}},[t("div",X,[t("div",Z,[t("img",{src:G,alt:"Finca Valerio",class:"logo-img",onError:l[0]||(l[0]=p=>p.target.style.display="none")},null,32)]),l[1]||(l[1]=t("div",{class:"title-section"},[t("h1",null,[i("FACTURA"),t("br"),i("VENTA")])],-1))]),t("div",tt,[t("p",null,[l[2]||(l[2]=t("strong",null,"Factura nº:",-1)),i(" "+s(d.factura.numero_factura),1)]),t("p",null,[l[3]||(l[3]=t("strong",null,"Fecha:",-1)),i(" "+s(x(d.factura.fecha)),1)]),t("p",null,[l[4]||(l[4]=t("strong",null,"Cliente:",-1)),i(" "+s(d.factura.cliente_nombre),1)]),d.factura.cliente_rnc?(c(),u("p",et,[l[5]||(l[5]=t("strong",null,"RNC:",-1)),i(" "+s(d.factura.cliente_rnc),1)])):R("",!0)]),t("table",ot,[l[6]||(l[6]=t("thead",null,[t("tr",null,[t("th",null,"Descripción"),t("th",null,"Cantidad"),t("th",null,"Precio"),t("th",null,"Total")])],-1)),t("tbody",null,[(c(!0),u(F,null,k(d.factura.productos,(p,V)=>(c(),u("tr",{key:V},[t("td",null,s(p.descripcion),1),t("td",null,s(p.cantidad),1),t("td",null,s(g(p.precio)),1),t("td",null,s(g(p.total)),1)]))),128))])]),t("div",at,[t("div",lt,[l[7]||(l[7]=t("span",null,"Subtotal",-1)),t("span",null,s(g(d.factura.subtotal)),1)]),t("div",nt,[l[8]||(l[8]=t("span",null,"Impuestos",-1)),t("span",null,s(g(d.factura.impuestos)),1)]),t("div",st,[l[9]||(l[9]=t("span",null,[t("strong",null,"TOTAL")],-1)),t("span",null,[t("strong",null,s(g(d.factura.total)),1)])])]),t("div",rt,[l[15]||(l[15]=t("div",{class:"footer-col"},[t("h3",null,"Contacto:"),t("p",null,"(55) 1234 - 5678"),t("p",null,"@Fincavalerio.com"),t("p",null,"www.fincavalerio.com")],-1)),t("div",it,[l[14]||(l[14]=t("h3",null,"Información de pago:",-1)),t("p",null,[l[10]||(l[10]=t("strong",null,"Nombre del banco:",-1)),i(" "+s(d.factura.banco||"Banreservas"),1)]),t("p",null,[l[11]||(l[11]=t("strong",null,"Número de cuenta:",-1)),i(" "+s(d.factura.cuenta||"0123 4567 8901"),1)]),t("p",null,[l[12]||(l[12]=t("strong",null,"Alias de cuenta:",-1)),i(" "+s(d.factura.alias||"Finca Valerio"),1)]),t("p",null,[l[13]||(l[13]=t("strong",null,"Fecha de pago:",-1)),i(" "+s(x(d.factura.fecha)),1)])])])],512))}},ct=U(dt,[["__scopeId","data-v-201030d2"]]),ut={class:"min-h-screen bg-[#fafafa] p-8"},pt={class:"mb-6 flex items-center justify-between"},ft={class:"text-2xl font-bold text-gray-900"},mt={class:"bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6"},gt={class:"grid grid-cols-1 lg:grid-cols-3 gap-8"},bt={class:"space-y-6"},xt={class:"form-group"},yt=["value"],vt={class:"form-group"},_t={class:"form-group"},ht={class:"flex flex-col gap-4 items-center justify-center"},wt={class:"w-full"},Ft=["value"],kt={class:"w-full flex gap-2"},Ct=["disabled"],Dt={class:"space-y-6"},Vt={class:"form-group"},$t={class:"form-group"},Tt={class:"form-group"},St=["value"],It={class:"form-group"},Nt={class:"bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6"},At={class:"w-full"},Lt={class:"divide-y divide-gray-100"},Et={class:"px-6 py-4 text-gray-900"},Rt={class:"px-6 py-4 text-gray-900"},Ut={class:"px-6 py-4 text-gray-900"},zt={class:"px-6 py-4 text-gray-900"},Pt={class:"px-6 py-4 text-right text-gray-900"},jt={class:"px-6 py-4 text-right font-bold text-gray-900"},Bt={class:"px-6 py-4 text-center"},Mt=["onClick"],Ot={key:0},qt={class:"bg-white rounded-xl shadow-sm border border-gray-200 p-6"},Gt={class:"flex items-center justify-between flex-wrap gap-6"},Yt={class:"flex items-center gap-8"},Qt={class:"flex items-center gap-4"},Wt={class:"flex items-center gap-4"},Ht=["value"],Jt={class:"flex gap-3 flex-wrap"},Kt=["disabled"],Xt={__name:"VentaForm",setup(d){const C=J(),_=H(),f=K(),x=E(()=>!!_.params.id),g=b(null),y=b(!1),a=Y({numero_factura:"FAC-001",fecha:new Date().toISOString().split("T")[0],ncf:"",concepto:"Leche",metodo_pago:"Transferencia",id_cliente:"",cliente_nombre:"",cliente_direccion:"",cliente_telefono:""}),r=b([]),l=b(""),p=b(1),V=E(()=>({numero_factura:a.numero_factura,fecha:a.fecha,cliente_nombre:a.cliente_nombre,productos:r.value.map(n=>({descripcion:n.descripcion,cantidad:n.cantidad,precio:n.precio,total:n.total})),subtotal:$(),impuestos:N(),total:A(),banco:"Banreservas",cuenta:"0123 4567 8901",alias:"Finca Valerio"})),S=b([{id_cliente:1,nombre:"Agropecuaria El Valle",rnc:"123456789",direccion:"Calle Principal #10",telefono:"809-555-1234"},{id_cliente:2,nombre:"Inversiones Ganaderas RD",rnc:"987654321",direccion:"Av. Central #45",telefono:"809-555-5678"}]),I=b([{id_producto:1,tipo:"Leche",descripcion:"Leche Fresca 1L",precio:85,stock:100},{id_producto:2,tipo:"Queso",descripcion:"Queso Fresco 1lb",precio:150,stock:50},{id_producto:3,tipo:"Yogurt",descripcion:"Yogurt Natural 500ml",precio:120,stock:75}]),z=b([{id_secuencia:1,ncf_completo:"B0100000001"},{id_secuencia:2,ncf_completo:"B0100000002"}]);function P(){const n=S.value.find(e=>e.id_cliente===parseInt(a.id_cliente));n&&(a.cliente_nombre=n.nombre,a.cliente_direccion=n.direccion,a.cliente_telefono=n.telefono)}Q(async()=>{if(x.value){const n=_.params.id;f.ventas.length===0&&await f.cargarVentas();const e=f.ventas.find(o=>o.id_venta==n);e&&(a.numero_factura=e.numero_factura||`FAC-${e.id_venta.toString().padStart(3,"0")}`,a.fecha=e.fecha?new Date(e.fecha).toISOString().split("T")[0]:"",a.ncf=e.ncf||"",a.concepto=e.concepto||"Leche",a.metodo_pago=e.metodo_pago||"Transferencia",a.id_cliente=e.id_cliente||"",e.cliente&&(a.cliente_nombre=e.cliente.nombre,a.cliente_direccion=e.cliente.direccion,a.cliente_telefono=e.cliente.telefono),e.productos_venta&&(r.value=e.productos_venta.map(o=>{var v,T;return{id_producto:o.id_producto,tipo:((v=o.producto)==null?void 0:v.tipo)||"N/A",descripcion:((T=o.producto)==null?void 0:T.descripcion)||"N/A",cantidad:o.cantidad,precio:o.precio_unitario,total:o.cantidad*o.precio_unitario}})),y.value=!0)}});function j(){if(!l.value)return;const n=I.value.find(v=>v.id_producto===parseInt(l.value));if(!n)return;const e=p.value||1,o=n.precio*e;r.value.push({id_producto:n.id_producto,tipo:n.tipo,descripcion:n.descripcion,cantidad:e,precio:n.precio,total:o}),l.value="",p.value=1}function B(n){r.value.splice(n,1)}function $(){return r.value.reduce((n,e)=>n+e.total,0)}function N(){return $()*.05}function A(){return $()+N()}function D(n){return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")}function M(){confirm("¿Está seguro de limpiar todos los datos?")&&(a.numero_factura="FAC-001",a.fecha=new Date().toISOString().split("T")[0],a.ncf="",a.concepto="Leche",a.metodo_pago="Transferencia",a.id_cliente="",a.cliente_nombre="",a.cliente_direccion="",a.cliente_telefono="",r.value=[],l.value="",p.value=1,y.value=!1)}async function O(){if(!a.id_cliente){alert("Debe seleccionar un cliente");return}if(r.value.length===0){alert("Debe agregar al menos un producto");return}if(!a.ncf){alert("Debe seleccionar un NCF");return}const n={id_cliente:parseInt(a.id_cliente),fecha:a.fecha,concepto:a.concepto,ncf:parseInt(a.ncf),estado:"activo",productos:r.value};let e;x.value?e=await f.actualizarVenta(_.params.id,n):e=await f.crearVenta(n),e.success?(y.value=!0,alert(x.value?"Factura actualizada correctamente":"Factura guardada correctamente")):alert("Error: "+e.error)}function q(){if(!y.value){alert("Primero debe guardar la factura");return}g.value&&g.value.imprimir()}return(n,e)=>(c(),u("div",ut,[t("div",pt,[t("div",null,[t("h1",ft,s(x.value?"Editar Factura":"Nueva Factura"),1),e[12]||(e[12]=t("p",{class:"text-sm text-gray-600"},"Complete los datos de la factura y agregue productos",-1))]),t("button",{onClick:e[0]||(e[0]=o=>L(C).push({name:"Venta"})),class:"flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"},[...e[13]||(e[13]=[t("span",{class:"material-symbols-outlined text-base"},"arrow_back",-1),i(" Volver ",-1)])])]),t("div",mt,[e[27]||(e[27]=t("h2",{class:"text-xl font-bold mb-6 pb-3 border-b-2 border-gray-100"},"Datos Factura",-1)),t("div",gt,[t("div",bt,[t("div",xt,[e[15]||(e[15]=t("label",{class:"form-label required"},[t("span",{class:"material-symbols-outlined"},"person"),i(" Cliente ")],-1)),m(t("select",{"onUpdate:modelValue":e[1]||(e[1]=o=>a.id_cliente=o),onChange:P,class:"form-select",required:""},[e[14]||(e[14]=t("option",{value:""},"Seleccione...",-1)),(c(!0),u(F,null,k(S.value,o=>(c(),u("option",{key:o.id_cliente,value:o.id_cliente},s(o.nombre),9,yt))),128))],544),[[h,a.id_cliente]])]),t("div",vt,[e[16]||(e[16]=t("label",{class:"form-label"},[t("span",{class:"material-symbols-outlined"},"location_on"),i(" Dirección ")],-1)),m(t("input",{"onUpdate:modelValue":e[2]||(e[2]=o=>a.cliente_direccion=o),type:"text",class:"form-input bg-gray-50",readonly:""},null,512),[[w,a.cliente_direccion]])]),t("div",_t,[e[17]||(e[17]=t("label",{class:"form-label"},[t("span",{class:"material-symbols-outlined"},"phone"),i(" Teléfono ")],-1)),m(t("input",{"onUpdate:modelValue":e[3]||(e[3]=o=>a.cliente_telefono=o),type:"text",class:"form-input bg-gray-50",readonly:""},null,512),[[w,a.cliente_telefono]])])]),t("div",ht,[t("div",wt,[e[19]||(e[19]=t("label",{class:"form-label text-center block mb-2"},[t("span",{class:"material-symbols-outlined"},"shopping_cart"),i(" Agregar Producto ")],-1)),m(t("select",{"onUpdate:modelValue":e[4]||(e[4]=o=>l.value=o),class:"form-select"},[e[18]||(e[18]=t("option",{value:""},"Seleccione producto...",-1)),(c(!0),u(F,null,k(I.value,o=>(c(),u("option",{key:o.id_producto,value:o.id_producto},s(o.descripcion)+" - RD$ "+s(D(o.precio)),9,Ft))),128))],512),[[h,l.value]])]),t("div",kt,[m(t("input",{"onUpdate:modelValue":e[5]||(e[5]=o=>p.value=o),type:"number",min:"1",placeholder:"Cantidad",class:"flex-1 form-input"},null,512),[[w,p.value,void 0,{number:!0}]]),t("button",{onClick:j,disabled:!l.value,class:"px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"}," Agregar ",8,Ct)]),t("button",{onClick:M,class:"w-full px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"},[...e[20]||(e[20]=[t("span",{class:"material-symbols-outlined"},"delete_sweep",-1),i(" Limpiar ",-1)])])]),t("div",Dt,[t("div",Vt,[e[21]||(e[21]=t("label",{class:"form-label"},[t("span",{class:"material-symbols-outlined"},"tag"),i(" Factura No. ")],-1)),m(t("input",{"onUpdate:modelValue":e[6]||(e[6]=o=>a.numero_factura=o),type:"text",class:"form-input bg-gray-50",readonly:""},null,512),[[w,a.numero_factura]])]),t("div",$t,[e[22]||(e[22]=t("label",{class:"form-label required"},[t("span",{class:"material-symbols-outlined"},"calendar_today"),i(" Fecha ")],-1)),m(t("input",{"onUpdate:modelValue":e[7]||(e[7]=o=>a.fecha=o),type:"date",class:"form-input",required:""},null,512),[[w,a.fecha]])]),t("div",Tt,[e[24]||(e[24]=t("label",{class:"form-label required"},[t("span",{class:"material-symbols-outlined"},"verified_user"),i(" NCF ")],-1)),m(t("select",{"onUpdate:modelValue":e[8]||(e[8]=o=>a.ncf=o),class:"form-select",required:""},[e[23]||(e[23]=t("option",{value:""},"Seleccione NCF...",-1)),(c(!0),u(F,null,k(z.value,o=>(c(),u("option",{key:o.id_secuencia,value:o.id_secuencia},s(o.ncf_completo),9,St))),128))],512),[[h,a.ncf]])]),t("div",It,[e[26]||(e[26]=t("label",{class:"form-label"},[t("span",{class:"material-symbols-outlined"},"category"),i(" Concepto ")],-1)),m(t("select",{"onUpdate:modelValue":e[9]||(e[9]=o=>a.concepto=o),class:"form-select"},[...e[25]||(e[25]=[t("option",{value:"Leche"},"Leche",-1),t("option",{value:"Ganado"},"Ganado",-1),t("option",{value:"Suministros"},"Suministros",-1)])],512),[[h,a.concepto]])])])])]),t("div",Nt,[t("table",At,[e[30]||(e[30]=t("thead",null,[t("tr",{class:"bg-gray-50 border-b border-gray-200"},[t("th",{class:"px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase"},"ID"),t("th",{class:"px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase"},"Tipo"),t("th",{class:"px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase"},"Descripción"),t("th",{class:"px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase"},"Cantidad"),t("th",{class:"px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase"},"Precio"),t("th",{class:"px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase"},"Total"),t("th",{class:"px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase"},"Acción")])],-1)),t("tbody",Lt,[(c(!0),u(F,null,k(r.value,(o,v)=>(c(),u("tr",{key:v,class:"hover:bg-gray-50"},[t("td",Et,s(o.id_producto),1),t("td",Rt,s(o.tipo),1),t("td",Ut,s(o.descripcion),1),t("td",zt,s(o.cantidad),1),t("td",Pt,"RD$ "+s(D(o.precio)),1),t("td",jt,"RD$ "+s(D(o.total)),1),t("td",Bt,[t("button",{onClick:T=>B(v),class:"p-2 hover:bg-red-50 rounded-lg transition-colors"},[...e[28]||(e[28]=[t("span",{class:"material-symbols-outlined text-red-600"},"delete",-1)])],8,Mt)])]))),128)),r.value.length===0?(c(),u("tr",Ot,[...e[29]||(e[29]=[t("td",{colspan:"7",class:"px-6 py-12 text-center text-gray-400"}," No hay productos agregados ",-1)])])):R("",!0)])])]),t("div",qt,[t("div",Gt,[t("div",Yt,[t("div",Qt,[e[32]||(e[32]=t("label",{class:"font-bold text-gray-900"},"Método Pago",-1)),m(t("select",{"onUpdate:modelValue":e[10]||(e[10]=o=>a.metodo_pago=o),class:"form-select w-48"},[...e[31]||(e[31]=[t("option",{value:"Transferencia"},"Transferencia",-1),t("option",{value:"Efectivo"},"Efectivo",-1),t("option",{value:"Tarjeta"},"Tarjeta",-1)])],512),[[h,a.metodo_pago]])]),t("div",Wt,[e[33]||(e[33]=t("label",{class:"font-bold text-gray-900"},"Total",-1)),t("input",{value:"RD$ "+D(A()),type:"text",class:"w-52 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-lg font-bold text-right text-green-800 text-xl",readonly:""},null,8,Ht)])]),t("div",Jt,[t("button",{onClick:O,class:"px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg flex items-center gap-2"},[...e[34]||(e[34]=[t("span",{class:"material-symbols-outlined"},"save",-1),i(" Guardar ",-1)])]),t("button",{onClick:q,disabled:!y.value,class:"px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"},[...e[35]||(e[35]=[t("span",{class:"material-symbols-outlined"},"print",-1),i(" Imprimir ",-1)])],8,Kt),t("button",{onClick:e[11]||(e[11]=o=>L(C).push({name:"Venta"})),class:"px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"},[...e[36]||(e[36]=[t("span",{class:"material-symbols-outlined"},"arrow_back",-1),i(" Volver ",-1)])])])])]),W(ct,{ref_key:"facturaImprimibleRef",ref:g,factura:V.value},null,8,["factura"])]))}},le=U(Xt,[["__scopeId","data-v-024c0797"]]);export{le as default};
