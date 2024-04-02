$(document).ready(function() {

    document.body.style.height = window.innerHeight + 'px';

    // Sembunyikan semua produk saat halaman dimuat
    $(".food-products").hide();
    $(".drink-products").hide();

    // Event listener untuk tombol menu makanan
    $(".menu-btn[data-menu='food']").click(function() {
        $(".drink-products").hide();
        $(".food-products").show();
    });

    // Event listener untuk tombol menu minuman
    $(".menu-btn[data-menu='drink']").click(function() {
        $(".food-products").hide();
        $(".drink-products").show();
    });

// Function to handle adding a product to the cart
$(".add-to-cart").click(function() {
    var productName = $(this).closest(".card-body").find(".card-title").text();
    var productPriceText = $(this).closest(".card-body").find(".card-text").text();
    var productMenu = $(this).data("menu"); // Menyimpan data menu

    // Cek apakah format teks harga produk sesuai dengan "Price: Rp.xx.xx"
    var productPriceMatch = productPriceText.match(/Rp\.\d+(?:\.\d+)?/);
    if (productPriceMatch) {
        var productPrice = parseFloat(productPriceMatch[0].replace("Rp.", "").replace(".", "").replace(",", "."));
    } else {
        // Jika format teks harga produk tidak sesuai, maka lakukan penyesuaian disini
        // Misalnya, jika harga produk berformat "Rp xx.xx", Anda perlu melakukan penyesuaian
        var productPrice = 0; // Nilai default jika tidak dapat menemukan harga produk
    }

    // Append the selected product to the shopping cart
    var cartItem = $("#cart ul li").filter(function() {
        return $(this).text().includes(productName) && $(this).data("menu") === productMenu; // Mencocokkan nama dan jenis menu produk
    });
    if (cartItem.length) {
        var quantityElement = cartItem.find(".quantity");
        var quantity = parseInt(quantityElement.text());
        quantityElement.text(quantity + 1);
        cartItem.find(".product-price").text("Rp " + formatRupiah((productPrice * (quantity + 1)).toFixed(2))); // Update product price in cart
    } else {
        // Append new cart item
        cartItem = "<li class='list-group-item d-flex justify-content-between align-items-center' data-menu='" + productMenu + "'>" + productName + "<span class='badge badge-primary badge-pill product-price'>Rp " + formatRupiah(productPrice.toFixed(2)) + "</span>";
        cartItem += "<div class='product-quantity'><button class='btn btn-sm btn-info decrease-quantity'>-</button> <span class='quantity'>1</span> <button class='btn btn-sm btn-info increase-quantity'>+</button></div></li>";
        $("#cart ul").append(cartItem);
    }

    updateTotal(); // Update the total price
});


    // Event listener to increase product quantity
    $("#cart").on("click", ".increase-quantity", function() {
        var quantityElement = $(this).siblings(".quantity");
        var quantity = parseInt(quantityElement.text());
        quantityElement.text(quantity + 1);
        updateTotal();
    });

    // Event listener to decrease product quantity or remove if quantity reaches 0
    $("#cart").on("click", ".decrease-quantity", function() {
        var quantityElement = $(this).siblings(".quantity");
        var quantity = parseInt(quantityElement.text());
        if (quantity > 1) {
            quantityElement.text(quantity - 1);
            updateTotal();
        } else {
            $(this).closest("li").remove(); // Remove the product from the cart
            updateTotal();
        }
    });

    // Function to handle checkout button click
    $("#checkoutBtn").click(function() {
        alert("Thank you for your purchase!");
        $("#cart ul").empty(); // Empty the shopping cart after checkout
        updateTotal(); // Update the total price
    });

    // Function to update the total price
    function updateTotal() {
        var totalPrice = 0;
        $("#cart ul li").each(function() {
            var price = parseFloat($(this).find(".product-price").text().replace("Rp ", "").replace(".", "").replace(",", "."));
            totalPrice += price;
        });
        var tax = totalPrice * 0.1; // Assuming 10% tax
        var discount = totalPrice * 0.05; // Assuming 5% discount
        var subtotal = totalPrice - discount; // Subtotal seharusnya total price sebelum diskon
        var totalHarga = subtotal + tax;

        // Update the total price, tax, discount, and subtotal in the cart
        $("#total-price").text("Rp " + formatRupiah(totalHarga.toFixed(2))); // Total Harga setelah diskon dan pajak
        $("#tax").text("Rp " + formatRupiah(tax.toFixed(2)));
        $("#discount").text("Rp " + formatRupiah(discount.toFixed(2)));
        $("#subtotal").text("Rp " + formatRupiah(subtotal.toFixed(2))); // Subtotal sebelum diskon
    }

    // Function to format number as Rupiah currency
    function formatRupiah(angka) {
        var number_string = angka.toString().replace(/[^,\d]/g, ""),
            split = number_string.split(","),
            sisa = split[0].length % 3,
            rupiah = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        // Tambahkan titik jika ribuan tidak null
        if (ribuan) {
            separator = sisa ? "." : "";
            rupiah += separator + ribuan.join(".");
        }

        rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
        return rupiah;
    }

    // Initial update total when page loaded
    updateTotal();
});
