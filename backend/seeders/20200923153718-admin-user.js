"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        name: "Admin",
        email: "admin@test.fr",
        password:
          "$2b$10$DMNKwd.sHJnXvVrZglTPreMtRSJgblyJ20TNfhcCtD2KFkCEEjY2O",
        avatar: "http://localhost:3000/images/avatar-default.png",
        isAdmin: true,
        bio: "Veuillez compléter votre profil...",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
