using System;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Effects;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace DesktopClock
{
    public class App : Application
    {
        [STAThread]
        public static void Main()
        {
            App app = new App();
            app.Run(new MainWindow());
        }
    }

    public class MainWindow : Window
    {
        private DispatcherTimer _clockTimer;
        private Border _mainBorder;
        private TextBlock _timeTextBlock;
        private TextBlock _dateTextBlock;
        private Border _settingsPanel;
        
        // Timer/Stopwatch states
        private TabControl _tabControl;
        private TextBlock _swTextBlock;
        private DispatcherTimer _swTimer;
        private DateTime _swStartTime;
        private TimeSpan _swElapsed = TimeSpan.Zero;
        private bool _swRunning = false;

        // Customization states
        private Color _themeColor = Color.FromRgb(0, 242, 254); // Cyan default
        private string _selectedFont = "Outfit";
        private bool _isDigital = true;
        private Canvas _analogCanvas;

        public MainWindow()
        {
            this.Title = "바탕화면 네온 시계";
            this.Width = 380;
            this.Height = 280;
            this.WindowStyle = WindowStyle.None;
            this.AllowsTransparency = true;
            this.Background = Brushes.Transparent;
            this.Topmost = true;
            this.WindowStartupLocation = WindowStartupLocation.CenterScreen;

            // Load settings if exist
            LoadSettings();

            // Enable dragging
            this.MouseLeftButtonDown += (snd, ev) => {
                if (ev.LeftButton == MouseButtonState.Pressed)
                    this.DragMove();
            };

            // Setup right click context menu
            ContextMenu ctxMenu = new ContextMenu();
            MenuItem miSettings = new MenuItem() { Header = "설정 토글" };
            miSettings.Click += (s1, e1) => ToggleSettings();
            MenuItem miTopmost = new MenuItem() { Header = "항상 위에 노출", IsCheckable = true, IsChecked = this.Topmost };
            miTopmost.Click += (s2, e2) => { this.Topmost = !this.Topmost; miTopmost.IsChecked = this.Topmost; SaveSettings(); };
            MenuItem miClose = new MenuItem() { Header = "종료" };
            miClose.Click += (s3, e3) => Application.Current.Shutdown();
            ctxMenu.Items.Add(miSettings);
            ctxMenu.Items.Add(miTopmost);
            ctxMenu.Items.Add(new Separator());
            ctxMenu.Items.Add(miClose);
            this.ContextMenu = ctxMenu;

            BuildUI();

            // Start timer
            _clockTimer = new DispatcherTimer();
            _clockTimer.Interval = TimeSpan.FromMilliseconds(100);
            _clockTimer.Tick += ClockTimer_Tick;
            _clockTimer.Start();
        }

        private void BuildUI()
        {
            Grid rootGrid = new Grid();

            // Main Glassmorphic Border
            _mainBorder = new Border()
            {
                Background = new SolidColorBrush(Color.FromArgb(204, 19, 21, 32)), // rgba(19, 21, 32, 0.8)
                BorderBrush = new SolidColorBrush(Color.FromArgb(26, 255, 255, 255)), // White 10%
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(16),
                Padding = new Thickness(15)
            };

            // Glow Effect
            DropShadowEffect shadow = new DropShadowEffect()
            {
                Color = _themeColor,
                BlurRadius = 15,
                ShadowDepth = 0,
                Opacity = 0.4
            };
            _mainBorder.Effect = shadow;

            // Inner Grid
            Grid innerGrid = new Grid();
            innerGrid.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            innerGrid.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(1, GridUnitType.Star) });

            // Title & Buttons bar
            Grid headerBar = new Grid();
            headerBar.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(1, GridUnitType.Star) });
            headerBar.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });

            TextBlock title = new TextBlock()
            {
                Text = "⏱ 바탕화면 위젯 시계",
                Foreground = Brushes.White,
                FontSize = 12,
                FontWeight = FontWeights.Bold,
                Opacity = 0.7,
                VerticalAlignment = VerticalAlignment.Center
            };
            headerBar.Children.Add(title);

            StackPanel headerButtons = new StackPanel() { Orientation = Orientation.Horizontal };
            Button btnSettings = new Button()
            {
                Content = "⚙",
                Background = Brushes.Transparent,
                BorderBrush = Brushes.Transparent,
                Foreground = Brushes.White,
                FontSize = 14,
                Cursor = Cursors.Hand,
                Width = 24,
                Height = 24,
                Margin = new Thickness(0, 0, 5, 0)
            };
            btnSettings.Click += (s4, e4) => ToggleSettings();
            
            Button btnClose = new Button()
            {
                Content = "✕",
                Background = Brushes.Transparent,
                BorderBrush = Brushes.Transparent,
                Foreground = Brushes.White,
                FontSize = 12,
                Cursor = Cursors.Hand,
                Width = 24,
                Height = 24
            };
            btnClose.Click += (s5, e5) => Application.Current.Shutdown();

            headerButtons.Children.Add(btnSettings);
            headerButtons.Children.Add(btnClose);
            Grid.SetColumn(headerButtons, 1);
            headerBar.Children.Add(headerButtons);

            innerGrid.Children.Add(headerBar);

            // Tab Control for Modes (Clock vs. Stopwatch)
            _tabControl = new TabControl()
            {
                Background = Brushes.Transparent,
                BorderBrush = Brushes.Transparent,
                Margin = new Thickness(0, 10, 0, 0)
            };
            Grid.SetRow(_tabControl, 1);

            // Style TabControl to hide headers
            Style s = new Style(typeof(TabItem));
            s.Setters.Add(new Setter(TabItem.VisibilityProperty, Visibility.Collapsed));
            _tabControl.ItemContainerStyle = s;

            // Tab 1: Clock
            TabItem tiClock = new TabItem();
            Grid clockGrid = new Grid();
            clockGrid.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(1, GridUnitType.Star) });
            clockGrid.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            _timeTextBlock = new TextBlock()
            {
                Text = "00:00:00",
                Foreground = new SolidColorBrush(_themeColor),
                FontSize = 38,
                FontWeight = FontWeights.Bold,
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center,
                FontFamily = new FontFamily(_selectedFont)
            };
            _timeTextBlock.Effect = new DropShadowEffect()
            {
                Color = _themeColor,
                BlurRadius = 10,
                ShadowDepth = 0,
                Opacity = 0.6
            };
            clockGrid.Children.Add(_timeTextBlock);

            // Analog Canvas (hidden by default)
            _analogCanvas = new Canvas()
            {
                Width = 120,
                Height = 120,
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center,
                Visibility = _isDigital ? Visibility.Collapsed : Visibility.Visible
            };
            clockGrid.Children.Add(_analogCanvas);

            _dateTextBlock = new TextBlock()
            {
                Text = "2026년 5월 31일 일요일",
                Foreground = Brushes.Gray,
                FontSize = 12,
                HorizontalAlignment = HorizontalAlignment.Center,
                Margin = new Thickness(0, 0, 0, 10)
            };
            Grid.SetRow(_dateTextBlock, 1);
            clockGrid.Children.Add(_dateTextBlock);

            tiClock.Content = clockGrid;
            _tabControl.Items.Add(tiClock);

            // Tab 2: Stopwatch
            TabItem tiStopwatch = new TabItem();
            Grid swGrid = new Grid();
            swGrid.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(1, GridUnitType.Star) });
            swGrid.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            _swTextBlock = new TextBlock()
            {
                Text = "00:00.00",
                Foreground = Brushes.White,
                FontSize = 36,
                FontWeight = FontWeights.Bold,
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center,
                FontFamily = new FontFamily("Consolas")
            };
            swGrid.Children.Add(_swTextBlock);

            StackPanel swControls = new StackPanel() { Orientation = Orientation.Horizontal, HorizontalAlignment = HorizontalAlignment.Center, Margin = new Thickness(0, 0, 0, 10) };
            Grid.SetRow(swControls, 1);
            
            Button btnSwStart = new Button() { Content = "시작", Width = 60, Height = 25, Margin = new Thickness(5), Background = new SolidColorBrush(Color.FromArgb(50, 0, 242, 254)), Foreground = Brushes.White };
            btnSwStart.Click += (s6, e6) => {
                if (!_swRunning) {
                    _swStartTime = DateTime.Now - _swElapsed;
                    _swTimer.Start();
                    _swRunning = true;
                    btnSwStart.Content = "일시정지";
                } else {
                    _swTimer.Stop();
                    _swRunning = false;
                    btnSwStart.Content = "시작";
                }
            };

            Button btnSwReset = new Button() { Content = "초기화", Width = 60, Height = 25, Margin = new Thickness(5), Background = new SolidColorBrush(Color.FromArgb(30, 255, 255, 255)), Foreground = Brushes.White };
            btnSwReset.Click += (s7, e7) => {
                _swTimer.Stop();
                _swRunning = false;
                _swElapsed = TimeSpan.Zero;
                _swTextBlock.Text = "00:00.00";
                btnSwStart.Content = "시작";
            };

            swControls.Children.Add(btnSwStart);
            swControls.Children.Add(btnSwReset);
            swGrid.Children.Add(swControls);

            tiStopwatch.Content = swGrid;
            _tabControl.Items.Add(tiStopwatch);

            // Stopwatch setup
            _swTimer = new DispatcherTimer();
            _swTimer.Interval = TimeSpan.FromMilliseconds(10);
            _swTimer.Tick += (s8, e8) => {
                _swElapsed = DateTime.Now - _swStartTime;
                _swTextBlock.Text = string.Format("{0:mm\\:ss\\.ff}", _swElapsed);
            };

            innerGrid.Children.Add(_tabControl);

            // Bottom Navigation Mode Buttons
            Grid bottomBar = new Grid() { VerticalAlignment = VerticalAlignment.Bottom, Height = 30, Margin = new Thickness(0, 0, 0, 5) };
            bottomBar.ColumnDefinitions.Add(new ColumnDefinition());
            bottomBar.ColumnDefinitions.Add(new ColumnDefinition());
            
            Button btnModeClock = new Button() { Content = "시계", Background = Brushes.Transparent, BorderBrush = Brushes.Transparent, Foreground = Brushes.White, Cursor = Cursors.Hand };
            btnModeClock.Click += (s9, e9) => _tabControl.SelectedIndex = 0;
            Button btnModeSw = new Button() { Content = "스톱워치", Background = Brushes.Transparent, BorderBrush = Brushes.Transparent, Foreground = Brushes.White, Cursor = Cursors.Hand };
            btnModeSw.Click += (s10, e10) => _tabControl.SelectedIndex = 1;

            Grid.SetColumn(btnModeClock, 0);
            Grid.SetColumn(btnModeSw, 1);
            bottomBar.Children.Add(btnModeClock);
            bottomBar.Children.Add(btnModeSw);
            
            Grid.SetRow(bottomBar, 1);
            innerGrid.Children.Add(bottomBar);

            _mainBorder.Child = innerGrid;
            rootGrid.Children.Add(_mainBorder);

            // Settings Overlay Panel (hidden by default)
            _settingsPanel = new Border()
            {
                Background = new SolidColorBrush(Color.FromArgb(238, 15, 17, 26)), // Dark opaque
                BorderBrush = new SolidColorBrush(Color.FromArgb(50, 255, 255, 255)),
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(16),
                Padding = new Thickness(15),
                Visibility = Visibility.Collapsed
            };
            
            StackPanel spSettings = new StackPanel();
            
            TextBlock settingsTitle = new TextBlock() { Text = "위젯 디스플레이 설정", Foreground = Brushes.White, FontSize = 14, FontWeight = FontWeights.Bold, Margin = new Thickness(0, 0, 0, 15) };
            spSettings.Children.Add(settingsTitle);

            // Color selection
            TextBlock lblColor = new TextBlock() { Text = "네온 광원 색상 선택", Foreground = Brushes.Gray, FontSize = 11, Margin = new Thickness(0, 0, 0, 5) };
            spSettings.Children.Add(lblColor);
            
            StackPanel spColors = new StackPanel() { Orientation = Orientation.Horizontal, Margin = new Thickness(0, 0, 0, 15) };
            Color[] colors = new Color[] {
                Color.FromRgb(0, 242, 254),  // Cyan
                Color.FromRgb(155, 81, 224), // Purple
                Color.FromRgb(16, 185, 129), // Green
                Color.FromRgb(245, 158, 11), // Orange
                Color.FromRgb(239, 68, 68)   // Red
            };
            foreach (var col in colors)
            {
                Button btnCol = new Button()
                {
                    Width = 24,
                    Height = 24,
                    Background = new SolidColorBrush(col),
                    Margin = new Thickness(4),
                    Cursor = Cursors.Hand
                };
                btnCol.Click += (s11, e11) => {
                    _themeColor = col;
                    _timeTextBlock.Foreground = new SolidColorBrush(col);
                    ((DropShadowEffect)_timeTextBlock.Effect).Color = col;
                    ((DropShadowEffect)_mainBorder.Effect).Color = col;
                    SaveSettings();
                };
                spColors.Children.Add(btnCol);
            }
            spSettings.Children.Add(spColors);

            // Clock Type Toggle
            TextBlock lblType = new TextBlock() { Text = "시계 표시 타입", Foreground = Brushes.Gray, FontSize = 11, Margin = new Thickness(0, 0, 0, 5) };
            spSettings.Children.Add(lblType);
            StackPanel spType = new StackPanel() { Orientation = Orientation.Horizontal, Margin = new Thickness(0, 0, 0, 15) };
            Button btnDigital = new Button() { Content = "디지털", Width = 70, Height = 25, Margin = new Thickness(0, 0, 5, 0) };
            btnDigital.Click += (s12, e12) => { _isDigital = true; _timeTextBlock.Visibility = Visibility.Visible; _analogCanvas.Visibility = Visibility.Collapsed; SaveSettings(); };
            Button btnAnalog = new Button() { Content = "아날로그", Width = 70, Height = 25 };
            btnAnalog.Click += (s13, e13) => { _isDigital = false; _timeTextBlock.Visibility = Visibility.Collapsed; _analogCanvas.Visibility = Visibility.Visible; SaveSettings(); };
            spType.Children.Add(btnDigital);
            spType.Children.Add(btnAnalog);
            spSettings.Children.Add(spType);

            // Close settings
            Button btnCloseSettings = new Button()
            {
                Content = "설정 완료",
                Height = 30,
                Background = new SolidColorBrush(Color.FromRgb(0, 242, 254)),
                Foreground = Brushes.Black,
                FontWeight = FontWeights.Bold,
                Margin = new Thickness(0, 15, 0, 0)
            };
            btnCloseSettings.Click += (s14, e14) => ToggleSettings();
            spSettings.Children.Add(btnCloseSettings);

            _settingsPanel.Child = spSettings;
            rootGrid.Children.Add(_settingsPanel);

            this.Content = rootGrid;
        }

        private void ToggleSettings()
        {
            if (_settingsPanel.Visibility == Visibility.Visible)
                _settingsPanel.Visibility = Visibility.Collapsed;
            else
                _settingsPanel.Visibility = Visibility.Visible;
        }

        private void ClockTimer_Tick(object sender, EventArgs e)
        {
            DateTime now = DateTime.Now;
            _timeTextBlock.Text = now.ToString("HH:mm:ss");
            _dateTextBlock.Text = now.ToString("yyyy년 M월 d일 dddd");

            if (!_isDigital)
            {
                RenderAnalogClock(now);
            }
        }

        private void RenderAnalogClock(DateTime time)
        {
            _analogCanvas.Children.Clear();

            double centerX = _analogCanvas.Width / 2;
            double centerY = _analogCanvas.Height / 2;
            double radius = 50;

            // Draw Face Outline
            Ellipse face = new Ellipse()
            {
                Width = radius * 2,
                Height = radius * 2,
                Stroke = new SolidColorBrush(_themeColor),
                StrokeThickness = 1.5
            };
            Canvas.SetLeft(face, centerX - radius);
            Canvas.SetTop(face, centerY - radius);
            _analogCanvas.Children.Add(face);

            // Hour Hand
            double hAngle = (time.Hour % 12) * 30 + time.Minute * 0.5;
            DrawHand(centerX, centerY, hAngle, radius * 0.5, Brushes.White, 2.5);

            // Minute Hand
            double mAngle = time.Minute * 6 + time.Second * 0.1;
            DrawHand(centerX, centerY, mAngle, radius * 0.75, Brushes.White, 1.5);

            // Second Hand
            double sAngle = time.Second * 6;
            DrawHand(centerX, centerY, sAngle, radius * 0.85, new SolidColorBrush(_themeColor), 1.0);

            // Center Pin
            Ellipse pin = new Ellipse() { Width = 4, Height = 4, Fill = Brushes.White };
            Canvas.SetLeft(pin, centerX - 2);
            Canvas.SetTop(pin, centerY - 2);
            _analogCanvas.Children.Add(pin);
        }

        private void DrawHand(double cx, double cy, double angle, double length, Brush brush, double thickness)
        {
            double rad = (angle - 90) * Math.PI / 180.0;
            double x = cx + length * Math.Cos(rad);
            double y = cy + length * Math.Sin(rad);

            Line hand = new Line()
            {
                X1 = cx,
                Y1 = cy,
                X2 = x,
                Y2 = y,
                Stroke = brush,
                StrokeThickness = thickness,
                StrokeEndLineCap = PenLineCap.Round
            };
            _analogCanvas.Children.Add(hand);
        }

        // Save Window State & Style
        private void SaveSettings()
        {
            try
            {
                string path = System.IO.Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "DesktopClock");
                if (!Directory.Exists(path)) Directory.CreateDirectory(path);

                using (StreamWriter sw = new StreamWriter(System.IO.Path.Combine(path, "settings.txt")))
                {
                    sw.WriteLine(this.Left);
                    sw.WriteLine(this.Top);
                    sw.WriteLine(_themeColor.ToString());
                    sw.WriteLine(_isDigital);
                    sw.WriteLine(this.Topmost);
                }
            }
            catch {}
        }

        private void LoadSettings()
        {
            try
            {
                string path = System.IO.Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "DesktopClock");
                string file = System.IO.Path.Combine(path, "settings.txt");
                if (File.Exists(file))
                {
                    using (StreamReader sr = new StreamReader(file))
                    {
                        double left = double.Parse(sr.ReadLine());
                        double top = double.Parse(sr.ReadLine());
                        string colStr = sr.ReadLine();
                        bool isDig = bool.Parse(sr.ReadLine());
                        bool topmost = bool.Parse(sr.ReadLine());

                        this.Left = left;
                        this.Top = top;
                        _themeColor = (Color)ColorConverter.ConvertFromString(colStr);
                        _isDigital = isDig;
                        this.Topmost = topmost;
                    }
                }
            }
            catch {}
        }
    }
}
