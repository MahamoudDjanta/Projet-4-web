<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #111111; }
        h1 { color: #E8002D; margin-bottom: 4px; }
        p { color: #6B7280; margin-top: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 24px; }
        th, td { border: 1px solid #F0F0F0; padding: 10px; text-align: left; }
        th { background: #FAFAFA; }
    </style>
</head>
<body>
    <h1>{{ $ecole }}</h1>
    <p>Classe : {{ $classe }} | Periode : {{ $periode }}</p>
    <table>
        <thead>
            <tr>
                <th>Eleve</th>
                <th>Presents</th>
                <th>Absences</th>
                <th>Taux</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($eleves as $eleve)
                <tr>
                    <td>{{ $eleve['nom'] }}</td>
                    <td>{{ $eleve['presents'] }}</td>
                    <td>{{ $eleve['absences'] }}</td>
                    <td>{{ $eleve['taux'] }}%</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
