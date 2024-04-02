<?php
session_start();

// Fungsi untuk validasi login
function validate_login($username, $password) {
    // Daftar username dan password yang valid
    $valid_credentials = array(
        'user123' => 'password123',
        'user456' => 'password456',
        'user789' => 'password789'
    );
    // Periksa apakah username ada dalam daftar dan password cocok
    return isset($valid_credentials[$username]) && $valid_credentials[$username] === $password;
}

// Proses login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if (validate_login($username, $password)) {
        // Login berhasil, simpan username dalam session
        $_SESSION['username'] = $username;
        header("Location: halaman_warteg.php");
        exit;
    } else {
        // Login gagal, redirect kembali ke halaman login dengan pesan error
        header("Location: login.php?error=1");
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <h2>Login</h2>
    <?php
    // Tampilkan pesan error jika login gagal
    if (isset($_GET['error']) && $_GET['error'] == 1) {
        echo "<p>Username atau password salah.</p>";
    }
    ?>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <input type="text" name="username" placeholder="Username" required><br><br>
        <input type="password" name="password" placeholder="Password" required><br><br>
        <button type="submit">Login</button>
    </form>
</body>
</html>
