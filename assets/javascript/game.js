// VARIABLES
var character = [];
var attacker = []
var defender = [];
var atkPower = 0;
var phase = "";

// FUNCTIONS
function startGame() {
    $(".secondary").empty();
    $("#info-panel").empty();
    $("#button-row1").empty();
    $("#button-row2").empty();
    $("#info-title").html("CHOOSE YOUR <span class='attack-result'>PLAYER</span>...");

    phase = "attacker-select";
    character = [
        { name: "Obi-Wan Kenobi", hp: 120, atk: 12, ca: 10, imageURL: "assets/images/obi-wan.jpg", index: "c0" },
        { name: "Luke Skywalker", hp: 100, atk: 20, ca: 8, imageURL: "assets/images/luke-skywalker.jpg", index: "c1" },
        { name: "Darth Sidious", hp: 150, atk: 8, ca: 15, imageURL: "assets/images/darth-sidius.png", index: "c2" },
        { name: "Darth Maul", hp: 180, atk: 10, ca: 25, imageURL: "assets/images/darth-maul.jpeg", index: "c3" }];

    // CREATE CHARACTER CARDS
    for (var i = 0; i < character.length; i++) {
        var charCard = $("<div>");
        charCard.addClass("card bg-secondary");
        charCard.attr("id", character[i].index);
        charCard.append("<img class=card-img-top src=" + character[i].imageURL + " alt='" + character[i].name + "'>");
        charCard.append("<div class='card-body'><h5 class='card-title'>" + character[i].name +
            "</h5><p class='card-text " + character[i].index + "-hp'> HP: " + character[i].hp + "</p></div>");
        $("#info-panel").append(charCard);
    }
}

// MAIN GAME
$(document).ready(function () {

    // CLICKING ON A CARD
    $("#info-panel").on("click", "div.card", function () {

        if (phase === "attacker-select") {
            attacker = character[this.id.slice(-1)];
            atkPower = attacker.atk;
            $("#attacker-title").html("ATTACKER");
            $("#attacker-panel").append($("#" + this.id).removeClass("bg-secondary").addClass("bg-info"));
            $("#info-title").html("CHOOSE YOUR <span class='counter-result'>TARGET</span>");
            phase = "defender-select";
            return;

        } else if (phase === "defender-select") {
            defender = character[this.id.slice(-1)];
            $("#defender-title").html("DEFENDER");
            $("#defender-panel").append($("#" + this.id).removeClass("bg-secondary").addClass("bg-dark"));
            $("#backup-title").html("BACKUP");
            $("#backup-panel").append($("#info-panel").html());
            $("#info-title").html("BATTLE STATS");
            $("#info-panel").html("&nbsp<br />&nbsp<br />&nbsp");
            $("#button-row1").html("<button type='button' class='btn btn-danger btn-lg' id='attack-button'> Attack </button>")
            phase = "battle";
        }
    });

    // CLICKING ON BACKUP
    $("#backup-panel").on("click", "div.card", function () {
        if (phase === "defender-select") {
            defender = character[this.id.slice(-1)];
            $("#defender-panel").append($("#" + this.id).removeClass("bg-secondary").addClass("bg-danger"));
            $("#info-title").html("BATTLE STATS");
            $("#attack-button").prop('disabled', false).removeClass("btn-secondary").addClass("btn-danger");
            phase = "battle";
        }
    });

    // CLICKING ON ATTACK BUTTON
    $("#button-row1").on("click", "#attack-button", function () {

        // ATTACK
        defender.hp -= atkPower;
        if (defender.hp > 0) {
            $("." + defender.index + "-hp").html("HP: " + defender.hp);
            $("#info-panel").html("Attack: " + atkPower + " damage");

            // WIN THE GAME
        } else if (defender.hp <= 0 && $("#backup-panel").children().length == 0) {
            $("#" + defender.index).fadeOut(250);
            $("#info-title").html(attacker.name.toUpperCase() + " SAVED THE GALAXY!");
            $("#info-panel").html("&nbsp<br />&nbsp<br />&nbsp");
            $("#defender-title").empty();
            $("#backup-title").empty();
            $("#attack-button").prop('disabled', true).removeClass("btn-danger").addClass("btn-secondary");
            $("#button-row2").append("<button type='button' class='btn btn-warning btn-lg' id='restart-button'> Start Over </button>").fadeIn(1500);
            return false;

            // BEAT THE DEFENDER
        } else {
            $("#info-title").html("You defeated " + defender.name + "!");
            $("#" + defender.index).fadeOut(700);
            $("#attack-button").prop('disabled', true).removeClass("btn-danger").addClass("btn-secondary");
            $("#info-title").html("CHOOSE YOUR NEXT TARGET FROM BACKUP!");
            phase = "defender-select";
            return false;
        }

        // COUNTERATTACK
        attacker.hp -= defender.ca;
        if (attacker.hp > 0) {
            $("." + attacker.index + "-hp").html("HP: " + attacker.hp);
            $("#info-panel").append("<br />Counter: " + defender.ca + " damage");

            // GAME OVER
        } else {
            $("#info-title").html("GAME OVER");
            var lastWords = [
                "'He... is the chosen one. He... will bring balance. Train him.'",
                "'Army or not, you must realize... you are doomed!'",
                "'He has control of the Senate and the Courts! He's too dangerous to be left alive!'",
                "'The Force is with me, and I am one with the Force...'"];
            $("#info-panel").html("&nbsp<br />" + lastWords[Math.floor(Math.random() * 4)] + "<br />&nbsp");
            $("#attack-button").prop('disabled', true).removeClass("btn-danger").addClass("btn-secondary");
            $("#button-row2").append("<button type='button' class='btn btn-warning btn-lg' id='restart-button'> Start Over </button>").fadeIn(1500);
            return false;
        }

        atkPower += attacker.atk;
        $("#info-panel").append("<br />Next Attack: " + atkPower + " dmg");
    })

    // CLICKING ON START OVER BUTTON
    $("#button-row2").on("click", "#restart-button", function () {
        startGame();
    })

    startGame();
})