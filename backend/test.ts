import 'dotenv/config'; // loads .env
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDbConnection() {
  try {
    console.log("Connecting to database...");
    
    // Fetch all restaurants
    const restaurants = await prisma.newrestaurants.findMany();
    
    console.log("✅ Successfully fetched restaurants:");
    console.dir(restaurants, { depth: null });

    // Print all listings per restaurant
    restaurants.forEach((restaurant) => {
      console.log(`\nListings for ${restaurant.name} (ID: ${restaurant.id}):`);
      restaurant.listings.forEach((listing, idx) => {
        console.log(`${idx + 1}. ${listing.title} — $${listing.discountedPrice} (Original: $${listing.originalPrice}, Qty: ${listing.quantity})`);
      });
    });
    
  } catch (error) {  
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from database.");
  }
}

// Run the test
testDbConnection();