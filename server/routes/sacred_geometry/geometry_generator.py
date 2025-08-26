"""
WiltonOS - Gerador de Geometria Sagrada

Este módulo gera imagens de geometria sagrada usando algoritmos matemáticos
e a biblioteca Pillow. Diferentes padrões são implementados como funções
independentes.
"""

import os
import math
import random
import json
import base64
import io
from datetime import datetime
from PIL import Image, ImageDraw, ImageFilter

# Constantes
PI = math.pi
GOLDEN_RATIO = (1 + math.sqrt(5)) / 2

def golden_ratio():
    """Retorna o número de ouro"""
    return GOLDEN_RATIO

def hsv_to_rgb(h, s, v):
    """Converte cores HSV para RGB"""
    h = float(h)
    s = float(s)
    v = float(v)
    h60 = h / 60.0
    h60f = math.floor(h60)
    hi = int(h60f) % 6
    f = h60 - h60f
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    
    if hi == 0: r, g, b = v, t, p
    elif hi == 1: r, g, b = q, v, p
    elif hi == 2: r, g, b = p, v, t
    elif hi == 3: r, g, b = p, q, v
    elif hi == 4: r, g, b = t, p, v
    elif hi == 5: r, g, b = v, p, q
    
    return int(r * 255), int(g * 255), int(b * 255)

def apply_quantum_noise(image, intensity=0.05):
    """Aplica ruído quântico à imagem para criar texturas"""
    pixels = image.load()
    width, height = image.size
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # Aplicar ruído aleatório com base na "incerteza quântica"
            if random.random() < intensity:
                noise = random.uniform(-20, 20)
                r = max(0, min(255, r + noise))
                g = max(0, min(255, g + noise))
                b = max(0, min(255, b + noise))
                
            pixels[x, y] = (int(r), int(g), int(b), a)
    
    return image

def flower_of_life(size=1000, background_color=(0, 0, 0, 255), circles=7, color_mode="rainbow"):
    """
    Gera uma imagem com o padrão Flor da Vida
    
    Args:
        size: Tamanho da imagem em pixels
        background_color: Cor de fundo (RGBA)
        circles: Número de círculos
        color_mode: "rainbow", "golden", "monochrome" ou "quantum"
        
    Returns:
        Caminho da imagem gerada
    """
    # Criar imagem com fundo transparente
    image = Image.new('RGBA', (size, size), background_color)
    draw = ImageDraw.Draw(image)
    
    # Calcular raio dos círculos
    radius = size / (circles * 2 + 2)
    center_x, center_y = size / 2, size / 2
    
    # Lista de círculos concêntricos desenhados
    drawn_circles = []
    
    # Desenhar círculo central
    drawn_circles.append((center_x, center_y))
    
    # Desenhar os círculos hexagonalmente
    for layer in range(1, circles + 1):
        # Para cada camada, desenhar círculos em um padrão hexagonal
        for i in range(6):
            angle = PI / 3 * i
            for j in range(layer):
                x = center_x + layer * radius * 2 * math.cos(angle)
                y = center_y + layer * radius * 2 * math.sin(angle)
                
                # Verificar se o círculo já foi desenhado
                if (x, y) not in drawn_circles:
                    drawn_circles.append((x, y))
                
                # Ângulo para a próxima posição
                angle += PI / 3
    
    # Desenhar todos os círculos
    for i, (x, y) in enumerate(drawn_circles):
        # Determinar a cor com base no modo escolhido
        if color_mode == "rainbow":
            # Esquema de cores arco-íris
            hue = (i / len(drawn_circles)) * 360
            stroke_color = hsv_to_rgb(hue, 0.8, 1.0)
            fill_color = hsv_to_rgb(hue, 0.3, 1.0)
            fill_color = fill_color + (50,)  # Adicionar alfa
        elif color_mode == "golden":
            # Esquema de cores dourado
            golden_value = (i / len(drawn_circles)) * 60 + 30
            stroke_color = hsv_to_rgb(golden_value, 0.8, 1.0)
            fill_color = hsv_to_rgb(golden_value, 0.3, 0.9)
            fill_color = fill_color + (30,)
        elif color_mode == "monochrome":
            # Esquema monocromático
            value = int(255 * (1 - (i / len(drawn_circles)) * 0.7))
            stroke_color = (value, value, value)
            fill_color = (0, 0, 0, 0)  # Transparente
        elif color_mode == "quantum":
            # Esquema quântico (azul profundo a púrpura)
            hue = 240 + (i / len(drawn_circles)) * 60
            stroke_color = hsv_to_rgb(hue, 0.9, 0.9)
            fill_color = hsv_to_rgb(hue, 0.3, 0.7)
            fill_color = fill_color + (20,)
        else:
            # Padrão
            stroke_color = (255, 255, 255)
            fill_color = (0, 0, 0, 0)
        
        # Desenhar círculo
        draw.ellipse(
            [(x - radius, y - radius), (x + radius, y + radius)],
            outline=stroke_color,
            fill=fill_color,
            width=max(1, int(size/500))
        )
    
    # Aplicar efeito quântico se selecionado
    if color_mode == "quantum":
        image = apply_quantum_noise(image)
    
    # Aplicar um leve desfoque para suavizar as bordas
    image = image.filter(ImageFilter.GaussianBlur(radius=0.5))
    
    # Converter a imagem para base64
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    # Criar URL de dados
    data_url = f"data:image/png;base64,{img_str}"
    
    return {
        'success': True,
        'message': f'Flor da Vida gerada com sucesso no modo {color_mode}',
        'image_url': data_url,
        'image_base64': img_str,
        'image_type': 'image/png'
    }

def metatrons_cube(size=1000, background_color=(0, 0, 0, 255), color_mode="rainbow"):
    """
    Gera uma imagem com o Cubo de Metatron
    
    Args:
        size: Tamanho da imagem em pixels
        background_color: Cor de fundo (RGBA)
        color_mode: "rainbow", "golden", "monochrome" ou "quantum"
        
    Returns:
        Caminho da imagem gerada
    """
    # Criar imagem
    image = Image.new('RGBA', (size, size), background_color)
    draw = ImageDraw.Draw(image)
    
    # Definir centro e raio
    center_x, center_y = size / 2, size / 2
    radius = size / 3
    
    # Calcular pontos do círculo interno
    num_points = 13
    points = []
    center_point = (center_x, center_y)
    points.append(center_point)
    
    # Primeiro círculo de pontos (6 pontos)
    first_radius = radius * 0.4
    for i in range(6):
        angle = PI / 3 * i
        x = center_x + first_radius * math.cos(angle)
        y = center_y + first_radius * math.sin(angle)
        points.append((x, y))
    
    # Segundo círculo de pontos (6 pontos)
    second_radius = radius * 0.8
    for i in range(6):
        angle = PI / 3 * i + PI / 6
        x = center_x + second_radius * math.cos(angle)
        y = center_y + second_radius * math.sin(angle)
        points.append((x, y))
    
    # Desenhar linhas conectando todos os pontos
    line_width = max(1, int(size/300))
    
    # Conexões entre pontos
    for i in range(len(points)):
        for j in range(i + 1, len(points)):
            # Determinar a cor da linha
            if color_mode == "rainbow":
                # Cada conjunto de linhas tem uma cor diferente
                hue = ((i * j) % 13) / 13 * 360
                line_color = hsv_to_rgb(hue, 0.7, 1.0)
            elif color_mode == "golden":
                # Cores douradas
                golden_hue = ((i * j) % 13) / 13 * 60 + 30
                line_color = hsv_to_rgb(golden_hue, 0.8, 1.0)
            elif color_mode == "monochrome":
                # Monocromático (mais brilhante para linhas externas)
                distance = math.sqrt((points[i][0] - points[j][0])**2 + (points[i][1] - points[j][1])**2)
                brightness = int(min(255, distance / size * 500))
                line_color = (brightness, brightness, brightness)
            elif color_mode == "quantum":
                # Esquema quântico
                hue = 240 + ((i * j) % 13) / 13 * 120
                saturation = 0.7 + ((i + j) % 5) / 10
                line_color = hsv_to_rgb(hue, saturation, 0.9)
            else:
                line_color = (255, 255, 255)
            
            draw.line([points[i], points[j]], fill=line_color, width=line_width)
    
    # Desenhar círculos nos pontos de intersecção
    for point in points:
        if color_mode == "rainbow":
            idx = points.index(point)
            hue = idx / len(points) * 360
            circle_color = hsv_to_rgb(hue, 0.8, 1.0)
        elif color_mode == "golden":
            idx = points.index(point)
            hue = idx / len(points) * 60 + 30
            circle_color = hsv_to_rgb(hue, 0.8, 1.0)
        elif color_mode == "monochrome":
            circle_color = (255, 255, 255)
        elif color_mode == "quantum":
            idx = points.index(point)
            hue = 240 + idx / len(points) * 120
            circle_color = hsv_to_rgb(hue, 0.9, 0.9)
        else:
            circle_color = (255, 255, 255)
        
        circle_radius = size / 50
        draw.ellipse(
            [(point[0] - circle_radius, point[1] - circle_radius),
             (point[0] + circle_radius, point[1] + circle_radius)],
            outline=circle_color,
            fill=circle_color,
            width=line_width
        )
    
    # Aplicar efeito quântico se selecionado
    if color_mode == "quantum":
        image = apply_quantum_noise(image)
    
    # Aplicar um leve desfoque para suavizar as bordas
    image = image.filter(ImageFilter.GaussianBlur(radius=0.7))
    
    # Converter a imagem para base64
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    # Criar URL de dados
    data_url = f"data:image/png;base64,{img_str}"
    
    return {
        'success': True,
        'message': f'Cubo de Metatron gerado com sucesso no modo {color_mode}',
        'image_url': data_url,
        'image_base64': img_str,
        'image_type': 'image/png'
    }

def sri_yantra(size=1000, background_color=(0, 0, 0, 255), color_mode="rainbow"):
    """
    Gera uma imagem do Sri Yantra
    
    Args:
        size: Tamanho da imagem em pixels
        background_color: Cor de fundo (RGBA)
        color_mode: "rainbow", "golden", "monochrome" ou "quantum"
        
    Returns:
        Caminho da imagem gerada
    """
    # Criar imagem
    image = Image.new('RGBA', (size, size), background_color)
    draw = ImageDraw.Draw(image)
    
    # Definir centro e raio
    center_x, center_y = size / 2, size / 2
    outer_radius = size * 0.45
    line_width = max(1, int(size/400))
    
    # Desenhar círculo externo
    if color_mode == "rainbow":
        circle_color = hsv_to_rgb(0, 0.8, 1.0)
    elif color_mode == "golden":
        circle_color = hsv_to_rgb(45, 0.8, 1.0)
    elif color_mode == "monochrome":
        circle_color = (255, 255, 255)
    elif color_mode == "quantum":
        circle_color = hsv_to_rgb(270, 0.8, 1.0)
    else:
        circle_color = (255, 255, 255)
    
    draw.ellipse(
        [(center_x - outer_radius, center_y - outer_radius),
         (center_x + outer_radius, center_y + outer_radius)],
        outline=circle_color,
        width=line_width
    )
    
    # Desenhar camadas de triângulos
    num_layers = 9
    
    # Calcular pontos dos triângulos
    for layer in range(num_layers):
        radius_factor = (num_layers - layer) / num_layers * outer_radius
        
        # Determinar a cor para esta camada
        if color_mode == "rainbow":
            hue = layer / num_layers * 360
            triangle_color = hsv_to_rgb(hue, 0.8, 1.0)
        elif color_mode == "golden":
            hue = layer / num_layers * 60 + 30
            triangle_color = hsv_to_rgb(hue, 0.8, 1.0)
        elif color_mode == "monochrome":
            brightness = int(255 * (layer + 1) / num_layers)
            triangle_color = (brightness, brightness, brightness)
        elif color_mode == "quantum":
            hue = 240 + layer / num_layers * 120
            triangle_color = hsv_to_rgb(hue, 0.9, 0.9)
        else:
            triangle_color = (255, 255, 255)
        
        # Alternar entre triângulos apontando para cima e para baixo
        points_up = []
        points_down = []
        
        # Número de triângulos depende da camada
        num_triangles = 4 + layer % 2
        
        for i in range(num_triangles):
            angle = 2 * PI / num_triangles * i
            
            # Triângulos apontando para cima
            x1 = center_x + radius_factor * math.cos(angle)
            y1 = center_y + radius_factor * math.sin(angle)
            
            angle_offset = 2 * PI / num_triangles
            x2 = center_x + radius_factor * math.cos(angle + angle_offset)
            y2 = center_y + radius_factor * math.sin(angle + angle_offset)
            
            # Ponto central ajustado para criar triângulo
            x3 = center_x
            y3 = center_y
            
            points_up.append([(x1, y1), (x2, y2), (x3, y3)])
            
            # Triângulos apontando para baixo (apenas nas camadas ímpares)
            if layer % 2 == 1:
                mid_angle = angle + angle_offset / 2
                x1 = center_x + radius_factor * 0.8 * math.cos(mid_angle)
                y1 = center_y + radius_factor * 0.8 * math.sin(mid_angle)
                
                x2 = center_x + radius_factor * 0.8 * math.cos(mid_angle + PI)
                y2 = center_y + radius_factor * 0.8 * math.sin(mid_angle + PI)
                
                # Ponto na borda
                x3 = center_x + radius_factor * math.cos(mid_angle + PI/2)
                y3 = center_y + radius_factor * math.sin(mid_angle + PI/2)
                
                points_down.append([(x1, y1), (x2, y2), (x3, y3)])
        
        # Desenhar triângulos
        for triangle in points_up:
            draw.polygon(triangle, outline=triangle_color, fill=None, width=line_width)
        
        for triangle in points_down:
            draw.polygon(triangle, outline=triangle_color, fill=None, width=line_width)
    
    # Desenhar Bindu (ponto central)
    bindu_radius = size / 40
    if color_mode == "rainbow":
        bindu_color = hsv_to_rgb(0, 0, 1.0)
    elif color_mode == "golden":
        bindu_color = hsv_to_rgb(45, 1.0, 1.0)
    elif color_mode == "monochrome":
        bindu_color = (255, 255, 255)
    elif color_mode == "quantum":
        bindu_color = hsv_to_rgb(300, 1.0, 1.0)
    else:
        bindu_color = (255, 255, 255)
    
    draw.ellipse(
        [(center_x - bindu_radius, center_y - bindu_radius),
         (center_x + bindu_radius, center_y + bindu_radius)],
        outline=bindu_color,
        fill=bindu_color,
        width=line_width
    )
    
    # Aplicar efeito quântico se selecionado
    if color_mode == "quantum":
        image = apply_quantum_noise(image)
    
    # Aplicar um leve desfoque para suavizar as bordas
    image = image.filter(ImageFilter.GaussianBlur(radius=0.5))
    
    # Converter a imagem para base64
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    # Criar URL de dados
    data_url = f"data:image/png;base64,{img_str}"
    
    return {
        'success': True,
        'message': f'Sri Yantra gerado com sucesso no modo {color_mode}',
        'image_url': data_url,
        'image_base64': img_str,
        'image_type': 'image/png'
    }

def merkaba(size=1000, background_color=(0, 0, 0, 255), color_mode="rainbow"):
    """
    Gera uma imagem do Merkaba (Estrela Tetraédrica)
    
    Args:
        size: Tamanho da imagem em pixels
        background_color: Cor de fundo (RGBA)
        color_mode: "rainbow", "golden", "monochrome" ou "quantum"
        
    Returns:
        Caminho da imagem gerada
    """
    # Criar imagem
    image = Image.new('RGBA', (size, size), background_color)
    draw = ImageDraw.Draw(image)
    
    # Definir centro e raio
    center_x, center_y = size / 2, size / 2
    radius = size * 0.4
    line_width = max(1, int(size/300))
    
    # Calcular vértices do primeiro tetraedro (apontando para cima)
    tetrahedron_up = []
    for i in range(3):
        angle = 2 * PI / 3 * i
        x = center_x + radius * math.cos(angle)
        y = center_y + radius * math.sin(angle)
        tetrahedron_up.append((x, y))
    
    # Adicionar ponto superior
    tetrahedron_up.append((center_x, center_y - radius * 0.8))
    
    # Calcular vértices do segundo tetraedro (apontando para baixo)
    tetrahedron_down = []
    for i in range(3):
        angle = 2 * PI / 3 * i + PI / 3
        x = center_x + radius * math.cos(angle)
        y = center_y + radius * math.sin(angle)
        tetrahedron_down.append((x, y))
    
    # Adicionar ponto inferior
    tetrahedron_down.append((center_x, center_y + radius * 0.8))
    
    # Determinar cores para os tetraedros
    if color_mode == "rainbow":
        color_up = hsv_to_rgb(120, 0.8, 1.0)  # Verde
        color_down = hsv_to_rgb(0, 0.8, 1.0)  # Vermelho
    elif color_mode == "golden":
        color_up = hsv_to_rgb(45, 0.8, 1.0)   # Dourado
        color_down = hsv_to_rgb(30, 0.9, 0.9) # Âmbar
    elif color_mode == "monochrome":
        color_up = (200, 200, 200)            # Cinza claro
        color_down = (100, 100, 100)          # Cinza escuro
    elif color_mode == "quantum":
        color_up = hsv_to_rgb(270, 0.9, 0.9)  # Roxo
        color_down = hsv_to_rgb(210, 0.9, 0.9)# Azul
    else:
        color_up = (255, 255, 255)            # Branco
        color_down = (200, 200, 200)          # Cinza claro
    
    # Desenhar as conexões do primeiro tetraedro
    for i in range(4):
        for j in range(i + 1, 4):
            draw.line([tetrahedron_up[i], tetrahedron_up[j]], fill=color_up, width=line_width)
    
    # Desenhar as conexões do segundo tetraedro
    for i in range(4):
        for j in range(i + 1, 4):
            draw.line([tetrahedron_down[i], tetrahedron_down[j]], fill=color_down, width=line_width)
    
    # Adicionar pontos nos vértices
    dot_radius = size / 60
    
    for point in tetrahedron_up:
        draw.ellipse(
            [(point[0] - dot_radius, point[1] - dot_radius),
             (point[0] + dot_radius, point[1] + dot_radius)],
            outline=color_up,
            fill=color_up,
            width=line_width
        )
    
    for point in tetrahedron_down:
        draw.ellipse(
            [(point[0] - dot_radius, point[1] - dot_radius),
             (point[0] + dot_radius, point[1] + dot_radius)],
            outline=color_down,
            fill=color_down,
            width=line_width
        )
    
    # Desenhar círculo central
    circle_radius = radius * 0.2
    
    if color_mode == "rainbow":
        circle_color = hsv_to_rgb(60, 0.8, 1.0)  # Amarelo
    elif color_mode == "golden":
        circle_color = hsv_to_rgb(50, 1.0, 1.0)  # Ouro intenso
    elif color_mode == "monochrome":
        circle_color = (255, 255, 255)           # Branco
    elif color_mode == "quantum":
        circle_color = hsv_to_rgb(300, 1.0, 1.0) # Magenta
    else:
        circle_color = (255, 255, 255)           # Branco
    
    draw.ellipse(
        [(center_x - circle_radius, center_y - circle_radius),
         (center_x + circle_radius, center_y + circle_radius)],
        outline=circle_color,
        width=line_width
    )
    
    # Aplicar efeito quântico se selecionado
    if color_mode == "quantum":
        image = apply_quantum_noise(image)
    
    # Aplicar um leve desfoque para suavizar as bordas
    image = image.filter(ImageFilter.GaussianBlur(radius=0.7))
    
    # Converter a imagem para base64
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    # Criar URL de dados
    data_url = f"data:image/png;base64,{img_str}"
    
    return {
        'success': True,
        'message': f'Merkaba gerado com sucesso no modo {color_mode}',
        'image_url': data_url,
        'image_base64': img_str,
        'image_type': 'image/png'
    }

def torus(size=1000, background_color=(0, 0, 0, 255), color_mode="rainbow"):
    """
    Gera uma imagem do Torus (visualização 2D)
    
    Args:
        size: Tamanho da imagem em pixels
        background_color: Cor de fundo (RGBA)
        color_mode: "rainbow", "golden", "monochrome" ou "quantum"
        
    Returns:
        Caminho da imagem gerada
    """
    # Criar imagem
    image = Image.new('RGBA', (size, size), background_color)
    draw = ImageDraw.Draw(image)
    
    # Definir centro e raio
    center_x, center_y = size / 2, size / 2
    outer_radius = size * 0.4
    inner_radius = outer_radius * 0.5
    line_width = max(1, int(size/400))
    
    # Número de círculos que formam o torus
    num_circles = 36
    
    # Desenhar os círculos que formam o torus
    for i in range(num_circles):
        angle = 2 * PI * i / num_circles
        circle_center_x = center_x + (outer_radius - inner_radius) * math.cos(angle)
        circle_center_y = center_y + (outer_radius - inner_radius) * math.sin(angle)
        
        # Calcular cor do círculo
        if color_mode == "rainbow":
            hue = i / num_circles * 360
            circle_color = hsv_to_rgb(hue, 0.8, 1.0)
        elif color_mode == "golden":
            hue = i / num_circles * 60 + 30
            circle_color = hsv_to_rgb(hue, 0.8, 1.0)
        elif color_mode == "monochrome":
            brightness = int(128 + 127 * math.sin(i / num_circles * 2 * PI))
            circle_color = (brightness, brightness, brightness)
        elif color_mode == "quantum":
            hue = 240 + i / num_circles * 120
            brightness = 0.7 + 0.3 * math.sin(i / num_circles * 4 * PI)
            circle_color = hsv_to_rgb(hue, 0.9, brightness)
        else:
            circle_color = (255, 255, 255)
        
        # Desenhar círculo
        draw.ellipse(
            [(circle_center_x - inner_radius, circle_center_y - inner_radius),
             (circle_center_x + inner_radius, circle_center_y + inner_radius)],
            outline=circle_color,
            width=line_width
        )
    
    # Desenhar linhas de fluxo
    num_flow_lines = 24
    num_points = 48
    
    for i in range(num_flow_lines):
        phase = 2 * PI * i / num_flow_lines
        points = []
        
        for j in range(num_points):
            angle = 2 * PI * j / num_points
            radius = outer_radius - inner_radius + inner_radius * math.sin(angle + phase)
            
            x = center_x + radius * math.cos(angle)
            y = center_y + radius * math.sin(angle)
            
            points.append((x, y))
        
        # Fechar o loop
        points.append(points[0])
        
        # Determinar cor da linha de fluxo
        if color_mode == "rainbow":
            hue = i / num_flow_lines * 360
            line_color = hsv_to_rgb(hue, 0.6, 1.0)
        elif color_mode == "golden":
            hue = i / num_flow_lines * 30 + 45
            line_color = hsv_to_rgb(hue, 0.7, 1.0)
        elif color_mode == "monochrome":
            brightness = int(128 + 127 * math.sin(i / num_flow_lines * 2 * PI))
            line_color = (brightness, brightness, brightness)
        elif color_mode == "quantum":
            hue = 210 + i / num_flow_lines * 60
            line_color = hsv_to_rgb(hue, 0.8, 1.0)
        else:
            line_color = (200, 200, 200)
        
        # Desenhar linha de fluxo
        draw.line(points, fill=line_color, width=max(1, line_width//2))
    
    # Aplicar efeito quântico se selecionado
    if color_mode == "quantum":
        image = apply_quantum_noise(image)
    
    # Aplicar um leve desfoque para suavizar as bordas
    image = image.filter(ImageFilter.GaussianBlur(radius=0.6))
    
    # Converter a imagem para base64
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    # Criar URL de dados
    data_url = f"data:image/png;base64,{img_str}"
    
    return {
        'success': True,
        'message': f'Torus gerado com sucesso no modo {color_mode}',
        'image_url': data_url,
        'image_base64': img_str,
        'image_type': 'image/png'
    }

def generate_all_patterns(size=1000, color_mode="quantum"):
    """
    Gera todas as imagens de geometria sagrada
    
    Args:
        size: Tamanho da imagem em pixels
        color_mode: "rainbow", "golden", "monochrome" ou "quantum"
        
    Returns:
        Lista com informações de todas as imagens geradas
    """
    # Gerar todas as imagens
    flower = flower_of_life(size=size, color_mode=color_mode)
    metatron = metatrons_cube(size=size, color_mode=color_mode)
    yantra = sri_yantra(size=size, color_mode=color_mode)
    merkaba_img = merkaba(size=size, color_mode=color_mode)
    torus_img = torus(size=size, color_mode=color_mode)
    
    # Retornar lista com todas as URLs
    return [
        flower['image_url'],
        metatron['image_url'],
        yantra['image_url'],
        merkaba_img['image_url'],
        torus_img['image_url']
    ]