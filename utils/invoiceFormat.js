const shippingDetails = (data) => {
    console.log("Inside shippingdetails")
    return({
        name : data.name,
        address : data.address,
        city : data.city
    });
}

