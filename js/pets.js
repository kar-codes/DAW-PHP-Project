$(function () {
  let pets = [];

  function fetchPets() {
    $.ajax({
      url: "php/get-pets.php",
      type: "GET",
      success: function (response) {
        console.log("Raw Response:", response);
        const result = JSON.parse(response);
        if (result.success) {
          pets = result.pets;
          let template = ``;
          pets.forEach((pet) => {
            template += `
              <tr data-id="${pet.id}">
                <td>${pet.id}</td>
                <td>${pet.name}</td>
                <td>${pet.description}</td>
                <td>
                  ${
                    pet.owner_name
                      ? pet.owner_name
                      : '<span style="color: red;">No Owner</span>'
                  }
                </td>
                <td>
                 <button type="button" class="btn btn-warning pet-modify"
                                data-bs-toggle="modal" data-bs-target="#editPetModal"
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
                          <button type="button" class="btn btn-danger pet-delete" data-bs-toggle="modal" data-bs-target="#deletePetModal"
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
          $("#pets-table tbody").html(template);
        } else {
          console.error("Error fetching pets: " + result.error);
        }
      },
      error: function () {
        console.error("Error during the AJAX request");
      },
    });
  }

  $(document).ready(function () {
    fetchPets();
  });

  $(document).on("click", ".add-owner", function () {
    const petId = $(this).data("pet-id");
    $("#addOwnerModal").modal("show");
  });

  //EVENT LISTENT OWNER LOGIC
  $(document).on("click", ".assign-owner", function () {
    const petId = $(this).data("pet-id");
    fetchOwnersAndShowModal(petId);
  });

  //LOGIC TO FETCH OWNER AND SHOW THE MODAL
  function fetchOwnersAndShowModal(petId) {
    // Fetch owners
    $.ajax({
      url: "php/get-owners.php",
      type: "GET",
      success: function (response) {
        const result = JSON.parse(response);
        if (result.success) {
          const owners = result.owners;
          showAssignOwnerModal(petId, owners);
        } else {
          console.error("Error fetching owners: " + result.error);
        }
      },
      error: function () {
        console.error("Error during the AJAX request");
      },
    });
  }

  // FUNCTION FOR MODAL W DROPDOWN
  function showAssignOwnerModal(petId, owners) {
    $("#assignOwnerDropdown").empty();

    //POPULATING DROPDOWN WITH OWNER NAMES
    owners.forEach((owner) => {
      $("#assignOwnerDropdown").append(
        `<option value="${owner.id}">${owner.name}</option>`
      );
    });

    $("#yourAssignOwnerModal").modal("show");

    $("#assignOwnerSaveBtn")
      .off("click")
      .on("click", function () {
        const selectedOwnerId = $("#assignOwnerDropdown").val();
        assignOwnerToPet(petId, selectedOwnerId);
      });
  }

  // START ASSIGN OWNER TO PET LOGIC
  function assignOwnerToPet(petId, ownerId) {
    $.ajax({
      url: "php/assign-owner.php",
      type: "POST",
      data: { petId: petId, ownerId: ownerId },
      success: function (response) {
        const result = JSON.parse(response);
        if (result.success) {
          fetchPets();
        } else {
          console.error("Error assigning owner: " + result.error);
        }
      },
      error: function () {
        console.error("Error during the AJAX request");
      },
    });
  }

  //LOGIC FOR OWNERS to populate my dropdown
  function fetchOwnersForDropdown() {
    $.ajax({
      url: "php/get-owners.php",
      type: "GET",
      success: function (response) {
        const result = JSON.parse(response);
        if (result.success) {
          const owners = result.owners;
          const dropdown = $("#ownerDropdown");

          // CLEAR THE EXISTING OPTIONS
          dropdown.empty();

          // THE OPTION FOR A NEW OWNER
          dropdown.append('<option value="new">Add New Owner</option>');

          // THE OWNERS THAT ALREADY EXIST WILL APPEAR HERE
          owners.forEach((owner) => {
            dropdown.append(
              `<option value="${owner.id}">${owner.name}</option>`
            );
          });
        } else {
          console.error("Error fetching owners: " + result.error);
        }
      },
      error: function () {
        console.error("Error during the AJAX request");
      },
    });
  }

  $("#editPetModal").on("show.bs.modal", function () {
    fetchOwnersForDropdown();
  });

  $(document).on("click", "#savePetChanges", function () {
    const selectedOwnerId = $("#ownerDropdown").val();

    if (selectedOwnerId === "new") {
      $("#addOwnerModal").modal("show");
    } else {
    }
  });

  $(document).on("click", "#savePetChanges", function () {
    const selectedOwnerId = $("#ownerDropdown").val();

    if (selectedOwnerId === "new") {
      $("#addOwnerModal").modal("show");
    } else {
      const petId = $("#editPetId").val();
      updatePetInformation(petId, selectedOwnerId);
    }
  });

  //MODIFY PET LOGIC START
  $(document).on("click", ".pet-modify", function (e) {
    e.preventDefault();
    const element = $(this).closest("tr");
    const petId = $(element).data("id");

    const pet = pets.find(function (pet) {
      return pet.id === petId;
    });

    populateFormWithOwnerData(pet);
  });

  function populateFormWithOwnerData(pet) {
    if (!pet) {
      console.error("Error: Invalid pet");
      return;
    }

  
    $("#editPetName").val(pet.name);
    $("#editPetDescription").val(pet.description);
    $("#ownerDropdown").val(pet.owner_id);

    $("#editPetId").val(pet.id);

    edit = true;
  }

function updatePetInformation(petId, ownerId) {
  var name = $("#editPetName").val();
  var description = $("#editPetDescription").val();
  var ownerId = $("#ownerDropdown").val(); 
  var petId = $("#editPetId").val(); 

  $.ajax({
    type: "POST",
    url: "php/modify-pet.php",
    data: {
      name: name,
      description: description,
      ownerId: ownerId,
      petId: petId,
    },
    dataType: "json",
    success: function (response) {
      if (response.success) {
  
        fetchPets();
       
        $("#editPetModal").modal("hide");
      } else {
        console.error("Error modifying pet: " + response.error);
      }
    },
    error: function () {
      console.error("Error during the AJAX request");
    },
  });
}

// Handle the submission of the edit owner form
$(document).on("click", "#savePetChanges", function () {
  const selectedOwnerId = $("#ownerDropdown").val();

  if (selectedOwnerId === "new") {
    // Show the modal to add a new owner
    $('#addOwnerModal').modal('show');
  } else {
    // Update pet information with the selected owner
    const petId = $("#editPetId").val(); // Add this line to get the pet ID
    updatePetInformation(petId, selectedOwnerId);
  }
});


  //END MODIFY PET LOGIC

  //START DELETE PET LOGIC

  $(document).on("click", ".pet-delete", function (e) {
    e.preventDefault();
    const element = $(this).closest("tr");
    const petId = $(element).data("id");

    const pet = pets.find(function (pet) {
      return pet.id === petId;
    });

    $("#confirmDeleteBtn").attr("data-pet-id", petId);

    $("#deletePetModal").modal("show");
  });

  $(document).on("click", "#confirmDeleteBtn", function () {
    const petId = $(this).attr("data-pet-id");

    $.ajax({
      type: "POST",
      url: "php/delete-pet.php",
      data: {
        petId: petId,
      },
      dataType: "json",
      success: function (response) {
        if (response.success) {
          fetchPets();

          $("#deletePetModal").modal("hide");
        } else {
          console.error("Error deleting pet: " + response.error);
        }
      },
      error: function () {
        console.error("Error during the AJAX request");
      },
    });
  });

  //END DELETE PET LOGIC

  //START of ADD PET logic

  $(document).on("submit", "#addPetForm", function (e) {
    e.preventDefault();

    const newPetName = $("#newPetName").val();
    const newPetDescription = $("#newPetDescription").val();
    var ownerId = $("#ownerDropdown2").val(); 
    
   
    $.ajax({
      type: "POST",
      url: "php/add-pet.php",
      data: {
        
        name: newPetName,
        description: newPetDescription,
        ownerId: ownerId,
        
      },
      dataType: "json",
      success: function (response) {
        console.log("Received owner data:", response);
        if (response.success) {
          fetchPets();

          $("#addPetModal").modal("hide");
          cleanAddNewModal();
        } else {
          console.error("Error adding new pet: " + response.error);
        }
      },
      error: function (xhr,status,error) {
        console.error("Error during the AJAX request");
        $("#addPetModalError").show();
        console.error("Error during the AJAX request");
        console.log("Status: " + status);
        console.log("Error: " + error);
        console.log("Response Text: " + xhr.responseText);
      },
    });
  });

  function fetchOwnersForDropdown2() {
    $.ajax({
      url: "php/get-owners.php",
      type: "GET",
      success: function (response) {
        const result = JSON.parse(response);
        if (result.success) {
          const owners = result.owners;
          const dropdown = $("#ownerDropdown2");

          // CLEAR THE EXISTING OPTIONS
          dropdown.empty();

          // THE OPTION FOR A NEW OWNER
          dropdown.append('<option value="new">Add New Owner</option>');

          // THE OWNERS THAT ALREADY EXIST WILL APPEAR HERE
          owners.forEach((owner) => {
            dropdown.append(
              `<option value="${owner.id}">${owner.name}</option>`
            );
          });
        } else {
          console.error("Error fetching owners: " + result.error);
        }
      },
      error: function () {
        console.error("Error during the AJAX request");
      },
    });
  }

  $("#addPetModal").on("show.bs.modal", function () {
    fetchOwnersForDropdown2();
  });

  //END of ADD PET logic




  //Filter pets LOGIC

  // START filter logic
$('#petNameFilter').on('input', function () {
  var petName = $(this).val().toLowerCase();
  var $filteredRows = $('#pets-table tbody tr').filter(function () {
      return $(this).text().toLowerCase().indexOf(petName) > -1;
  });

  // Show or hide rows based on the filter
  $('#pets-table tbody tr').each(function () {
      var shouldShow = $filteredRows.length === 0 || $filteredRows.is($(this));
      $(this).toggle(shouldShow);
  });

  // Show the noOwnersModal if no matching rows found
  if (!$filteredRows.length && petName.trim() !== "") {
   
      $("#noPetsModal").modal("show");
  }
  //filter pets END
});

//clean modal function
function cleanAddNewModal() {
  $("#addPetModalError").hide();
  $("#newPetName").val("");
  $("#newPetDescription").val("");
  $("#ownerDropdown2").val("");
}

//START of ADD OWNER logic

  // Handle the submission of the add owner form
  $(document).on("submit", "#addNewOwnerForm", function (e) {
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

});
