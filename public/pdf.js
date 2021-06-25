window.onload = function () {
    document.getElementById("download")
        .addEventListener("click", () => {
            const invoice = this.document.getElementById("invoice");
            var dash = this.document.getElementById("dashboard");
            var printbtn = this.document.getElementById("download");
            var desc = this.document.getElementById("desc");
            var rate = this.document.getElementById("rate");
            var qty = this.document.getElementById("qty");
            var total = this.document.getElementById("total");
            var findtotal = this.document.getElementById("findtotal");
            var addrow = this.document.getElementById("add-row");
            var deleterow = this.document.getElementById("delete-row");
            var getsubtotal = this.document.getElementById("getsubtotal");
           
            var no = document.getElementById("invoiceno")
            no.innerHTML +="Invoice No ";
            no.innerHTML += Math.floor((Math.random() * 1000000) + 1);

            n =  new Date();
            y = n.getFullYear();
            m = n.getMonth() + 1;
            d = n.getDate();
            document.getElementById("date").innerHTML = d + "/" + m + "/" + y;

            printbtn.style.visibility = 'hidden';
            desc.style.visibility = 'hidden';
            rate.style.visibility = 'hidden';
            qty.style.visibility = 'hidden';
            dash.style.visibility = 'hidden';
            total.style.visibility = 'hidden';
            findtotal.style.visibility='hidden';
            addrow.style.visibility = 'hidden';
            deleterow.style.visibility = 'hidden';
            getsubtotal.style.visibility = 'hidden';
            console.log(invoice);
            console.log(window);
            var opt = {
                margin: 1,
                filename: 'myfile.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            window.print()
            
            printbtn.style.visibility = 'visible';
            dash.style.visibility = 'visible';
            desc.style.visibility = 'visible';
            total.style.visibility = 'visible';
            rate.style.visibility = 'visible';
            qty.style.visibility = 'visible';
            findtotal.style.visibility='visible';
            addrow.style.visibility = 'visible';
            deleterow.style.visibility = 'visible';
            getsubtotal.style.visibility = 'visible';

            no.innerHTML = "";
        })
             
}
