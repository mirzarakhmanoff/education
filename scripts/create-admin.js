// Скрипт для создания администратора
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const readline = require("readline")

// Определение модели пользователя (должно соответствовать вашей модели)
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
)

// Хеширование пароля перед сохранением
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    this.password = await bcrypt.hash(this.password, 12)
    next()
  } catch (error) {
    next(error)
  }
})

// Создание интерфейса для ввода данных
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Подключение к базе данных
async function connectToDatabase() {
  try {
    // Используйте вашу строку подключения к MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/edu-portal"
    await mongoose.connect(MONGODB_URI)
    console.log("Подключено к базе данных MongoDB")
  } catch (error) {
    console.error("Ошибка подключения к базе данных:", error)
    process.exit(1)
  }
}

// Функция для создания администратора
async function createAdmin() {
  try {
    await connectToDatabase()

    // Регистрация модели
    const User = mongoose.models.User || mongoose.model("User", userSchema)

    // Запрос данных администратора
    rl.question("Введите имя администратора: ", (name) => {
      rl.question("Введите email администратора: ", (email) => {
        rl.question("Введите пароль администратора (минимум 8 символов): ", async (password) => {
          try {
            // Проверка существования пользователя
            const existingUser = await User.findOne({ email })

            if (existingUser) {
              // Если пользователь существует, обновляем его роль
              existingUser.role = "admin"
              await existingUser.save()
              console.log(`Пользователь ${email} обновлен до роли администратора`)
            } else {
              // Создание нового администратора
              const admin = new User({
                name,
                email,
                password,
                role: "admin",
              })

              await admin.save()
              console.log(`Администратор ${email} успешно создан`)
            }
          } catch (error) {
            console.error("Ошибка при создании администратора:", error)
          } finally {
            mongoose.connection.close()
            rl.close()
          }
        })
      })
    })
  } catch (error) {
    console.error("Ошибка:", error)
    rl.close()
  }
}

// Запуск функции создания администратора
createAdmin()
