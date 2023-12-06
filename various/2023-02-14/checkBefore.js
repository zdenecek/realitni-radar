


db.houses.find().forEach(element => {
  if(!element.priceHistory) return;
  Object.keys(element.priceHistory).forEach( (index,price) => {
    const date = new Date(index);
    if(date < new Date(element.inserted)) {
      console.log("House: " + element.id + " has a priceHistory date before the inserted date" + date.toISOString() );
    };
  });

});