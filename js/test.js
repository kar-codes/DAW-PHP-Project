 //START of MODIFY OWNER logic

 $(document).on("click", ".pet-modify", function (e) {
  e.preventDefault();
  const element = $(this).closest("tr");
  const ownerId = $(element).data("id");

  const owner = owners.find(function (owner) {
    return owner.id === ownerId;
  });

  populateFormWithPetData(pet);
});

function populateFormWithPetData(pet) {
  if (!owner) {
    console.error("Error: Invalid pet");
    return;
  }

  // Set the values for other form fields
  $("#editName").val(owner.name);
  $("#editIdCard").val(owner.id_card);
  $("#editEmail").val(owner.email);
  $("#editPhoneNumber").val(owner.phone_number);

  // Set the ownerId for the hidden input field
  $("#editOwnerId").val(owner.id);

  edit = true;
}

// Handle the submission of the edit owner form
$(document).on("submit", "#editOwnerForm", function (e) {
  e.preventDefault();

  var name = $("#editName").val();
  var idCard = $("#editIdCard").val();
  var email = $("#editEmail").val();
  var phoneNumber = $("#editPhoneNumber").val();
  var ownerId = $("#editOwnerId").val(); // This will be hidden in your form

  // AJAX request to update owner
  $.ajax({
    type: "POST",
    url: "php/modify-owner.php",
    data: {
      name: name,
      idCard: idCard,
      email: email,
      phoneNumber: phoneNumber,
      ownerId: ownerId,
    },
    dataType: "json",
    success: function (response) {
      if (response.success) {
        // Refresh the owners table
        fetchOwners();
        // Hide the modal
        $("#editOwnerModal").modal("hide");
      } else {
        console.error("Error modifying owner: " + response.error);
      }
    },
    error: function () {
      console.error("Error during the AJAX request");
    },
  });
});

//END of MODIFY OWNER logic