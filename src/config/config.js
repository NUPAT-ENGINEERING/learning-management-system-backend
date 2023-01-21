export const Config = {
    DATABASE: process.env.DB || 'lms-nupat',
    DATABASE_USER: process.env.DB_USER || 'root',
    DATABASE_PASSWORD: process.env.DB_PASSWORD || '',
    PORT: process.env.PORT || 8080
}
