FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5175

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["AnimeTakusan.MAL.API/AnimeTakusan.MAL.API.csproj", "AnimeTakusan.MAL.API/"]
RUN dotnet restore "AnimeTakusan.MAL.API/AnimeTakusan.MAL.API.csproj"
COPY . .
WORKDIR "/src/AnimeTakusan.MAL.API"
RUN dotnet build "AnimeTakusan.MAL.API.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "AnimeTakusan.MAL.API.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AnimeTakusan.MAL.API.dll"]
