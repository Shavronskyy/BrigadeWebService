# ===== RUNTIME =====
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://0.0.0.0:8080

# ===== BUILD =====
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копіюємо csproj (шляхи відносно ./backend/)
COPY BrigadeWebService_API/*.csproj BrigadeWebService_API/
COPY BrigadeWebService_BLL/*.csproj BrigadeWebService_BLL/
COPY BrigadeWebService_DAL/*.csproj BrigadeWebService_DAL/

RUN dotnet restore BrigadeWebService_API/BrigadeWebService_API.csproj

# Копіюємо решту коду
COPY . .

RUN dotnet publish BrigadeWebService_API/BrigadeWebService_API.csproj -c Release -o /app/publish /p:UseAppHost=false

# ===== FINAL =====
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet","BrigadeWebService_API.dll"]
