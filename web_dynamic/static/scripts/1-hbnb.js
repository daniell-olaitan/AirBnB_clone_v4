$(function () {
  let amenities = {};

  $('.amenity').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    let selectedAmenities = '';

    if ($(this).is(':checked')) {
      amenities[amenityId] = amenityName;
    } else {
      delete amenities[amenityId];
    }

    Object.values(amenities).forEach(amenity => {
      selectedAmenities = selectedAmenities + `${amenity} `;
    });

    $('#selected-amenities').text(selectedAmenities);
  });
});
