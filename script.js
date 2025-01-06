$(document).ready(function () {
    $("#startGame").click(function () {
        $("#intro").hide();
        $("#gameContainer").show();
        init(); 
    });

    var canvas = $("#ruang")[0];
    var ctx = canvas.getContext("2d");
    var cols = 7, rows = 6;
    var gridSize = canvas.width / cols;
    var board = [];
    var player1 = "red"; // Pemain 1
    var player2 = "yellow"; // Pemain 2
    var currentPlayer = player1; 
    var isGameActive = false;

    function init() {
        if (!ctx) {
            console.error("Canvas context tidak ditemukan!");
            return;
        }

        board = Array(rows).fill().map(() => Array(cols).fill(null));
        currentPlayer = player1; 
        isGameActive = true;
        drawBoard();
        $("#notif").text("").css("color", "black");
        $("#resetGame").show();
    }

    function drawBoard() {
        ctx.fillStyle = "#3498db"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let x = c * gridSize;
                let y = r * gridSize;
                ctx.fillStyle = board[r][c] || "white";
                ctx.beginPath();
                ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2 - 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.strokeStyle = "#2980b9";
                ctx.stroke();
            }
        }
    }
    $("#ruang").click(function (e) {
        if (!isGameActive) return;
    
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width; // Koreksi skala
        var x = (e.clientX - rect.left) * scaleX; // Sesuaikan dengan skala
        var col = Math.floor(x / gridSize);
    
        if (col < 0 || col >= cols) return; // Cegah klik di luar area
    
        for (var r = rows - 1; r >= 0; r--) {
            if (!board[r][col]) {
                board[r][col] = currentPlayer;
                drawBoard();
    
                if (checkWin(r, col)) {
                    isGameActive = false;
                    $("#notif").text((currentPlayer === player1) ? "Player 1 (Merah) Menang! Klik Reset Permainan Untuk Mengulang Permainan" : "Player 2 (Kuning) Menang! Klik Reset Permainan Untuk Mengulang Permainan");
                    return;
                }
    
                currentPlayer = (currentPlayer === player1) ? player2 : player1;
                return;
            }
        }
        alert("Kolom penuh!");
    });
    
    function checkWin(row, col) {
        var directions = [
            { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },
            { dr: 1, dc: 1 },
            { dr: 1, dc: -1 }
        ];

        for (var d = 0; d < directions.length; d++) {
            var dir = directions[d];
            var count = 1;

            count += countTokens(row, col, dir.dr, dir.dc);
            count += countTokens(row, col, -dir.dr, -dir.dc);

            if (count >= 4) return true;
        }
        return false;
    }

    function countTokens(row, col, dr, dc) {
        var r = row + dr;
        var c = col + dc;
        var count = 0;

        while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    $("#resetGame").click(function () {
        init();
    });

});
