# ===== RUNTIME (.NET 9) =====
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://0.0.0.0:8080

# ===== BUILD (.NET 9 SDK) =====
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копіюємо лише csproj (швидше restore)
COPY BrigadeWebService_API/*.csproj BrigadeWebService_API/
COPY BrigadeWebService_BLL/*.csproj BrigadeWebService_BLL/
COPY BrigadeWebService_DAL/*.csproj BrigadeWebService_DAL/

RUN dotnet restore BrigadeWebService_API/BrigadeWebService_API.csproj

# Копіюємо весь код
COPY . .

RUN dotnet publish BrigadeWebService_API/BrigadeWebService_API.csproj -c Release -o /app/publish /p:UseAppHost=false

# ===== FINAL =====
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet","BrigadeWebService_API.dll"]
