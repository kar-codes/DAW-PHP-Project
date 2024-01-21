$(function () {
  let owners = []; //made owners into an empty array globally
  $("#addOwnerModalError").hide(); //hiding the owner modal error until i need it

  //START of script to POPULATE my pets owners table with ajax
  function fetchOwners() {
    $.ajax({
      url: "php/get-owners.php",
      type: "GET",
      success: function (response) {
        console.log("Raw Response:", response);
        const result = JSON.parse(response);
        if (result.success) {
          owners = result.owners;
          let template = ``;
          owners.forEach((owner) => {
            template += `
                      <tr data-id="${owner.id}">
                          <td>${owner.id}</td>
                          <td>${owner.name}</td>
                          <td>${owner.id_card}</td>
                          <td>${owner.email}</td>
                          <td>${owner.phone_number}</td>
                          <td>
                            <button type="button" class="btn btn-warning owner-modify"
                                data-bs-toggle="modal" data-bs-target="#editOwnerModal"
                                style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                  class="bi bi-pencil-square" viewBox="0 0 16 16">
                                  <path
                                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                  <path fill-rule="evenodd"
                                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                            </button>
                        </td>
                        <td>
                          <button type="button" class="btn btn-danger"
                            style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
                              viewBox="0 0 16 16">
                              <path
                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                              <path
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                          </button>
                        </td>
                      </tr> `;
          });
          $("#owners-table tbody").html(template);
        } else {
          console.error("Error fetching owners: " + result.error);
        }
      },
      error: function () {
        console.error("Error during the AJAX request");
      },
    });
  }

  // Call fetchOwners() when the page loads
  $(document).ready(function () {
    fetchOwners();
  });

  //END of script to POPULATE TABLE

  //START of MODIFY OWNER logic

  $(document).on("click", ".owner-modify", function (e) {
    e.preventDefault();
    const element = $(this).closest("tr");
    const ownerId = $(element).data("id");

    const owner = owners.find(function (owner) {
      return owner.id === ownerId;
    });

    populateFormWithOwnerData(owner);
  });

  function populateFormWithOwnerData(owner) {
    if (!owner) {
      console.error("Error: Invalid owner");
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

  //START of ADD OWNER logic

  // Handle the submission of the add owner form
  $(document).on("submit", "#addOwnerForm", function (e) {
    e.preventDefault();

    var newName = $("#newName").val();
    var newIdCard = $("#newIdCard").val();
    var newEmail = $("#newEmail").val();
    var newPhoneNumber = $("#newPhoneNumber").val();

    // AJAX request to add new owner
    $.ajax({
      type: "POST",
      url: "php/add-owner.php",
      data: {
        name: newName,
        idCard: newIdCard,
        email: newEmail,
        phoneNumber: newPhoneNumber,
      },
      dataType: "json",
      success: function (response) {
        console.log("Received owner data:", response);
        if (response.success) {
          // Refresh the owners table
          fetchOwners();
          // Hide the modal
          $("#addOwnerModal").modal("hide");
          cleanAddNewModal();
        } else {
          console.error("Error adding new owner: " + response.error);
        }
      },
      error: function () {
        console.error("Error during the AJAX request");
        $("#addOwnerModalError").show();
      },
    });
  });

  //END of ADD OWNER logic

  //START DELETE OWNER logic
  // Handle the click on the delete owner button
  $(document).on("click", ".btn-danger", function (e) {
    e.preventDefault();
    const element = $(this).closest("tr");
    const ownerId = $(element).data("id");

    const owner = owners.find(function (owner) {
      return owner.id === ownerId;
    });

  
    $("#confirmDeleteBtn").attr("data-owner-id", ownerId);

 
    $("#deleteOwnerModal").modal("show");
  });

  // Handle the click on the confirm delete button
  $(document).on("click", "#confirmDeleteBtn", function () {
    const ownerId = $(this).attr("data-owner-id");

    // AJAX request to delete owner
    $.ajax({
      type: "POST",
      url: "php/delete-owner.php",
      data: {
        ownerId: ownerId,
      },
      dataType: "json",
      success: function (response) {
        if (response.success) {
          // Refresh the owners table
          fetchOwners();
          // Hide the delete owner confirmation modal
          $("#deleteOwnerModal").modal("hide");
        } else {
          console.error("Error deleting owner: " + response.error);
        }
      },
      error: function () {
        console.error("Error during the AJAX request");
      },
    });
  });

  //END DELETE OWNER logic

  //clean modal function
  function cleanAddNewModal() {
    $("#addOwnerModalError").hide();
    $("#newName").val("");
    $("#newIdCard").val("");
    $("#newEmail").val("");
    $("#newPhoneNumber").val("");
  }


 // START filter logic
$('#ownerNameFilter').on('input', function () {
  var ownerName = $(this).val().toLowerCase();
  var $filteredRows = $('#owners-table tbody tr').filter(function () {
      return $(this).text().toLowerCase().indexOf(ownerName) > -1;
  });

  // Show or hide rows based on the filter
  $('#owners-table tbody tr').each(function () {
      var shouldShow = $filteredRows.length === 0 || $filteredRows.is($(this));
      $(this).toggle(shouldShow);
  });

  // Show the noOwnersModal if no matching rows found
  if ($filteredRows.length === 0 && ownerName.trim() !== "") {
   
      $("#noOwnersModal").modal("show");
  }
});
// END filter logic
});
