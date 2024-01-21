  //START of log-in script
  $(document).on("submit", "#loginForm", function (e) {
    e.preventDefault(); //we're preventing a page reload when clicking the submit button

    // Getting username and password from the form(id of form loginForm)
    var username = $("#username").val();
    var password = $("#password").val();

    // the AJAX request to the server-side PHP script(log-in.php)
    $.ajax({
      type: "POST",
      url: "./php/log-in.php",
      data: { username: username, password: password },
      dataType: "json", // Specifying the expected data type
      success: function (response) {
        if (response.status === "success") {
          // Here i'm redirecting to the dashboard page or any other page
          window.location.href = "./dashboard.html";
        } else {
          // Displaying an error message
          $("#errorMessage").text("Invalid username or password");
        }
      },
      error: function () {
        // Displaying another error message
        $("#errorMessage").text("Error during the AJAX request");
      },
    });
  });
  //END of log-in script
